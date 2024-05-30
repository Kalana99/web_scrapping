from django.db import models

class NewsScanResult(models.Model):
    name = models.CharField(max_length=100)
    headline = models.CharField(max_length=255)
    summary = models.TextField()
    url = models.URLField()
    date_scanned = models.DateTimeField(auto_now_add=True)

class WebsiteContent(models.Model):
    url = models.URLField(unique=True)
    content = models.TextField()
    date_scanned = models.DateTimeField(auto_now=True)
