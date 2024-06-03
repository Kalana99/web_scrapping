import requests
from bs4 import BeautifulSoup
from difflib import unified_diff
import openai
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from myapp.models import NewsScanResult, WebsiteContent
from django.conf import settings
from celery import shared_task

from utils.WebScanner import WebScanner
from utils.NewsScanner import NewsScanner
from utils.EmailClient import EmailClient

@shared_task
def fetch_news_for_names(names):
    
    news = []

    for name in names:
        
        articles = fetch_news_for_name(name)
        
        if len(articles) > 0:
            news.append({name: articles})
        
    if send_news_summary_email(news):
        return news
    return False

@shared_task
def fetch_news_for_name(name):
        
    news_scanner = NewsScanner()
    result = news_scanner.scan_single_news(name)
    
    print(result)
    return result

@shared_task
def check_website_changes(names, urls):
    
    web_changes = []
    
    for i in range(len(urls)):
        
        result = fetch_and_compare_website_content(names[i], urls[i])
        
        if result['diff']:
            web_changes.append(result)
            
    if send_web_difference_email(web_changes):
        return web_changes
    return False

@shared_task
def fetch_and_compare_website_content(name, url):
    
    web_scanner = WebScanner()    
    response= web_scanner.scan_single_website(name, url)

    return response[0]

@shared_task
def fetch_and_compare_two_websites(url1, url2):
    
    web_scanner = WebScanner()    
    response = web_scanner.compare_two_websites(url1, url2)

    return response

@shared_task
def compare_text(text1, text2):
    
    web_scanner = WebScanner()
    return web_scanner.compare_text(text1, text2)

def send_news_summary_email(results):
    
    print(results)
    
    if len(results) > 0:
        
        content = "<p>Hello,</p><p>Here are the latest news updates for our clients:</p>"
        
        for result in results:
            
            content += f"<p><b>{result.name}</b><br>"
            content += f"<b>Headline:</b> {result.headline}<br>"
            content += f"<b>Summary:</b> {result.summary}<br>"
            content += f"<b>Link:</b> <a href='{result.url}'>{result.url}</a></p>"
            
        content += "<p>Best regards</p>"
        
        emailClient = EmailClient()
        response = emailClient.send_email('Clients in the news', content)
        
        if response is not None:
            return True
    return False

def send_web_difference_email(results):
    
    print(results)
    
    if len(results) > 0:
        
        content = "<p>Hello,</p><p>Here are the latest website content changes detected:</p>"
        
        for result in results:
            
            content += f"<p><b>{result['name']}</b> ({result['url']})<br>"
            content += f"<b>Summary:</b> {result['summary']}</p><br><br>"
            
        content += "<p>Best regards</p>"
        
        emailClient = EmailClient()
        response = emailClient.send_email('Website Content Changes Detected', content)
        
        if response is not None:
            return True
    return False
