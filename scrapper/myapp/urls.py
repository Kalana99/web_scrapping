from django.urls import path
from .views import news_scan_results, website_content, single_news_scan, single_website_scan, text_compare, web_compare

urlpatterns = [
    path('all-news-scan/', news_scan_results, name='all_news_scan'),
    path('all-website-scan/', website_content, name='all_website_scan'),
    path('single-news-scan/', single_news_scan, name='single_news_scan'),
    path('single-website-scan/', single_website_scan, name='single_website_scan'),
    path('text-compare/', text_compare, name='text_compare'),
    path('web-compare/', web_compare, name='web_compare'),
]