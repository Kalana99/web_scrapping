from django.urls import path
from .views import single_news_scan, single_website_scan, text_compare

urlpatterns = [
    path('single-news-scan/', single_news_scan, name='single_news_scan'),
    path('single-website-scan/', single_website_scan, name='single_website_scan'),
    path('text-compare/', text_compare, name='text_compare'),
]