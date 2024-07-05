from django.db import models
from db_connection import db

# Create your models here.

web_client_collection = db['web_clients']
news_client_collection = db['news_clients']
content_collection = db['contents']
