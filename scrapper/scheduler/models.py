from django.db import models
from db_connection import db

# Create your models here.

client_collection = db['clients']
content_collection = db['contents']
