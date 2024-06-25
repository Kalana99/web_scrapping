from datetime import datetime, timedelta
from bson import ObjectId
import requests
from bs4 import BeautifulSoup
import difflib
import json
import os
from openai import OpenAI

from utils.ExcelReader import ExcelReader
import scrapper.settings as settings
from scheduler.models import content_collection


def convert_objectid_to_str(data):
    if isinstance(data, list):
        return [convert_objectid_to_str(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_objectid_to_str(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

class WebScanner:
    
    def __init__(self):
        
        self.changes = []
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.excel_path = "utils/web.xlsx"
        (self.names, self.websites) = ExcelReader.read_excel_file(self.excel_path)

    def scan_websites(self):
        
        for i in range(len(self.websites)):
            
            url = self.websites[i]
            name = self.names[i]
            
            changes = self.scan_single_website(name, url)
            
            if changes:
                self.changes.append(changes)
                
        return self.changes
    
    def scan_single_website(self, name, url):
        
        current_content = self._fetch_current_content(url)
        previous_content = self._load_previous_content(name, url)
        
        today_date = datetime.today().strftime('%Y-%m-%d')
        
        if current_content == False:
            
            print(f"Invalid URL: {url}")
            
            return ({
                "name": name,
                "url": url,
                "date": today_date,
                "diff": False,
                "summary": "Invalid URL. Required format: http(s)://example.domain (.com, .au, .lk, etc.)"
            }, "")
            
        if previous_content == False or current_content != previous_content:
            
            summary = self._summarize_website_changes(previous_content, current_content)
            
            self._save_current_content(name, url, current_content)
            
            return ({
                "name": name,
                "url": url,
                "date": today_date,
                "diff": True,
                "summary": summary.message.content
            }, current_content)
        else:
            
            print(f"No change detected for {name}")
            
            return ({
                "name": name,
                "url": url,
                "date": today_date,
                "diff": False,
                "summary": "No changes detected"
            }, current_content)
            
    def compare_two_websites(self, url1, url2):
        
        content1 = self._fetch_current_content(url1)
        content2 = self._fetch_current_content(url2)
        
        if content1 != content2:
            
            summary = self._summarize_diff_web(content1, content2)
            
            return {
                "url1": url1,
                "url2": url2,
                "summary": summary.message.content
            }
        else:
            print(f"No change detected")
            return {
                "url1": url1,
                "url2": url2,
                "summary": "No changes detected"
            }
        
    def compare_text(self, text1, text2):
        
        summary  = self._summarize_diff(text1, text2)
        
        return summary.message.content

    def _fetch_current_content(self, url):
        
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract text content excluding design elements
            texts = soup.find_all(['p', 'h1', 'h2', 'h3'])
            content = ' '.join([text.get_text() for text in texts])
            
            return content
        except Exception as e:
            print(f"Error fetching content from {url}: {e}")
            return False
    
    def _load_previous_content(self, name, url):
        
        yesterday_date = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')
            
        try:
            prev_data = content_collection.find_one({"name": name, "url": url, "date": yesterday_date})
        except Exception as e:
            prev_data = {}

        if prev_data:
            return convert_objectid_to_str(prev_data).get('content', '')
        return False
    
    def _summarize_website_changes(self, prev, cur):
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "user",
                    "content": f"Summarize the differences from the following previous and current contents of the same website. If the first text is the word False, simply summarize the second text. Otherwise, pointout the changes/updates between the two text in a structured format. Make sure to point out the spelling changes, title or subtitle changes, description additions or deletions. \n\nPrevious: \n{prev}\n\nCurrent: \n{cur}",
                }
            ],
        )
        return response.choices[0]
    
    def _summarize_diff(self, text1, text2):
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "user",
                    "content": f"Summarize the differences from the following first text to the second text. If the first text is the word False, simply summarize the second text. Otherwise, pointout the changes between the two text in a structured format. Make sure to point out the spelling changes: \n\nText1: \n{text1}\n\nText2: \n{text2}",
                }
            ],
        )
        return response.choices[0]
    
    def _summarize_diff_web(self, text1, text2):
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "user",
                    "content": f"Below provided the contents of two websites as Website1 and Website2. Summarize the differences between them. Point out what industries they are related to and explain the difences between the website contents: \n\nWebsite1: \n{text1}\n\nWebsite2: \n{text2}",
                }
            ],
        )
        return response.choices[0]

    def _save_current_content(self, name, url, current_content):
        
        today_date = datetime.today().strftime('%Y-%m-%d')
            
        try:
            if content_collection.find_one({"name": name, "url": url, "date": today_date}) is not None:
                content_collection.update_one({"name": name, "url": url, "date": today_date}, {"$set": {"content": current_content}})
            else:
                content_collection.insert_one({"name": name, "url": url, "date": today_date, "content": current_content})
        except Exception as e:
            print(e)
            print(f"Error saving content for {name} at {url}")
            