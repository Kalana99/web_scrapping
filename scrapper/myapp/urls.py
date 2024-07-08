from django.urls import path
from .views import news_scan_results, website_content, single_news_scan, single_website_scan, text_compare, web_compare, add_web_client, add_web_clients, add_news_client, add_news_clients, get_web_clients, get_news_clients

urlpatterns = [
    path('all-news-scan/', news_scan_results, name='all_news_scan'),
    path('all-website-scan/', website_content, name='all_website_scan'),
    path('single-news-scan/', single_news_scan, name='single_news_scan'),
    path('single-website-scan/', single_website_scan, name='single_website_scan'),
    path('text-compare/', text_compare, name='text_compare'),
    path('web-compare/', web_compare, name='web_compare'),
    path('add-web-client/', add_web_client, name='add_web_client'),
    path('bulk-add-web-clients/', add_web_clients, name='bulk_add_web_clients'),
    path('add-news-client/', add_news_client, name='add_news_client'),
    path('bulk-add-news-clients/', add_news_clients, name='bulk_add_news_clients'),
    path('get-web-clients/', get_web_clients, name='get_web_clients'),
    path('get-news-clients/', get_news_clients, name='get_news_clients'),
]