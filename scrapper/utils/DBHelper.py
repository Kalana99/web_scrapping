from datetime import datetime, timedelta
from bson import ObjectId
import requests
from bs4 import BeautifulSoup
import difflib
import json
import os

import scrapper.settings as settings
from scheduler.models import content_collection, web_client_collection, news_client_collection


class DBHelper:
    
    @staticmethod
    def add_web_client(name, url):
            
        try:
            if web_client_collection.find_one({"name": name, "url": url}) is None:
                web_client_collection.insert_one({"name": name, "url": url})
            return True
        except Exception as e:
            print(e)
            print(f"Error adding web client {name} at {url}")
            return False
    
    @staticmethod        
    def add_web_clients(clients):
        pass
        
    #     for i in range(len(clients)):
    #         DBHelper.add_web_client(names[i], urls[i])
    
    @staticmethod        
    def add_news_client(name):
        
        try:
            if news_client_collection.find_one({"name": name}) is None:
                news_client_collection.insert_one({"name": name})
            return True
        except Exception as e:
            print(e)
            print(f"Error adding news client {name}")
            return False
    
    @staticmethod    
    def add_news_clients(names):
        
        for name in names:
            DBHelper.add_news_client(name)
    
    @staticmethod
    def convert_objectid_to_str(data):
        
        if isinstance(data, list):
            return [DBHelper.convert_objectid_to_str(item) for item in data]
        elif isinstance(data, dict):
            return {key: DBHelper.convert_objectid_to_str(value) for key, value in data.items()}
        elif isinstance(data, ObjectId):
            return str(data)
        else:
            return data
    
    @staticmethod
    def _load_previous_content(name, url):
        
        yesterday_date = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')
        
        try:
            prev_data = content_collection.find_one({"name": name, "url": url, "date": yesterday_date})
        except Exception as e:
            prev_data = None

        if prev_data:
            return DBHelper.convert_objectid_to_str(prev_data).get('content', '')
        return False
    
    @staticmethod
    def _save_current_content(name, url, current_content):
        
        today_date = datetime.today().strftime('%Y-%m-%d')
            
        try:
            if content_collection.find_one({"name": name, "url": url, "date": today_date}) is not None:
                content_collection.update_one({"name": name, "url": url, "date": today_date}, {"$set": {"content": current_content}})
            else:
                content_collection.insert_one({"name": name, "url": url, "date": today_date, "content": current_content})
            return True
        except Exception as e:
            print(e)
            print(f"Error saving content for {name} at {url}")
            return False
