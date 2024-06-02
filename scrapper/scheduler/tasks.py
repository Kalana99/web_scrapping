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

@shared_task
def fetch_news_for_names(names):

    for name in names:
        articles = fetch_news_for_name(name)
        for article in articles:
            NewsScanResult.objects.create(
                name=name,
                headline=article['title'],
                summary=article['description'] or '',
                url=article['url']
            )
    send_news_summary_email()

@shared_task
def fetch_news_for_name(name):
        
    news_scanner = NewsScanner()
    result = news_scanner.scan_single_news(name)
    
    print(result)
    return result

@shared_task
def check_website_changes(names, urls):
    
    for i in range(len(urls)):
        # TODO: Add changes to a list
        fetch_and_compare_website_content(names[i], urls[i])

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

def send_news_summary_email():
    results = NewsScanResult.objects.filter(date_scanned__gte=timezone.now() - timedelta(days=1))
    if results.exists():
        content = "<p>Hello,</p><p>Here are the latest news updates for our clients:</p>"
        for result in results:
            content += f"<p><b>{result.name}</b><br>"
            content += f"<b>Headline:</b> {result.headline}<br>"
            content += f"<b>Summary:</b> {result.summary}<br>"
            content += f"<b>Link:</b> <a href='{result.url}'>{result.url}</a></p>"
        content += "<p>Best regards,<br>Your Company Name</p>"
        send_mail(
            'Clients in the news',
            '',
            settings.DEFAULT_FROM_EMAIL,
            ['hello@finsed.com'],
            html_message=content
        )

def summarize_and_send_changes(url, changes):
    openai.api_key = 'your_openai_api_key'
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Summarize the following changes:\n\n{changes}",
        max_tokens=150
    )
    summary = response.choices[0].text.strip()
    content = f"<p>Changes detected on <a href='{url}'>{url}</a>:</p><p>{summary}</p>"
    send_mail(
        'Website Content Changes Detected',
        '',
        settings.DEFAULT_FROM_EMAIL,
        ['hello@finsed.com'],
        html_message=content
    )
