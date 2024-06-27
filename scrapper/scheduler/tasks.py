import requests
import json
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
    
    print("Operating web change check email sending")
    web_changes = []
    web_scanner = WebScanner()
    
    for i in range(len(urls)):
        
        result = web_scanner.scan_single_website(names[i].strip(), urls[i].strip())[0]
        
        if result['diff']:
            web_changes.append(result)
            
    if send_web_difference_email(web_changes):
        return web_changes
    return False

@shared_task
def fetch_and_compare_website_content(name: str, url: str):
    
    web_scanner = WebScanner()    
    result = web_scanner.scan_single_website(name.strip(), url.strip())[0]
    
    if result["diff"]:
        send_web_difference_email([result])

    return result

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

def send_web_difference_email(results: list[dict]):
    
    if len(results) > 0:
        
        content = "<p>Hello,</p><p>Here are the latest website content changes detected:</p>"
        
        for result in results:
            
            summary = parse_str_to_json(result['summary'])
            key_lst = list(summary.keys())
            
            content += f"<h3><b>{result['name']}</b> ({result['url']})</h3>"
            
            for key in key_lst:
                
                if len(summary[key]) > 0:
                
                    content += f"<h4>{key}</h4>"
                    content += "<ul>"
                    
                    for item in summary[key]:
                        
                        content += f"<li>{item}</li>"
                        
                    content += "</ul>"
                    
            content += "<br>"
            
        content += "<p>Best regards</p>"
        
        emailClient = EmailClient()
        response = emailClient.send_email('Website Content Changes Detected', content)
        
        if response is not None:
            return True
    return False

def parse_str_to_json(summary: str):
    
    try:
        cleaned_summary = summary.replace("```json\n", "").replace("\n```", "")
        json_object = json.loads(cleaned_summary)
    except json.decoder.JSONDecodeError:
        json_object = json.loads(summary)
    
    return json_object
