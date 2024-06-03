from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
import difflib
import json
import os
from openai import OpenAI

from utils.ExcelReader import ExcelReader
import scrapper.settings as settings


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
            
            summary = self._summarize_diff(previous_content, current_content)
            
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
        
        file_path = "utils/web/current/content.json"
        yesterday_date = (datetime.today() - timedelta(days=1)).strftime('%Y-%m-%d')
        
        try:
            with open(file_path, 'r') as file:
                try:
                    data = json.load(file)
                except json.JSONDecodeError:
                    data = []
        except FileNotFoundError:
            data = []

        for obj in data:
            if obj.get('name') == name and obj.get('url') == url and obj.get('date') == yesterday_date:
                return obj.get('content', "")
        
        return False
        
    def _get_changes(self, current_content, previous_content):
        
        diff = difflib.ndiff(previous_content.splitlines(), current_content.splitlines())
        changes = '\n'.join(diff)
        
        return changes
    
    def _summarize_changes(self, changes):
        
        response = self.client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "user",
                    "content": f"Summarize the following changes:\n\n{changes}",
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
                    "content": f"Summarize the differences from the following first text to the second text. Make sure to point out the spelling changes: \n\nText1: \n{text1}\n\nText2: \n{text2}",
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
        
        file_path = "utils/web/current/content.json"
        today_date = datetime.today().strftime('%Y-%m-%d')

        # Load existing data from the file or initialize an empty list
        if os.path.exists(file_path):
            with open(file_path, 'r') as file:
                try:
                    data = json.load(file)
                except json.JSONDecodeError:
                    data = []
        else:
            data = []

        # Check if an object with the given name and URL already exists
        updated = False
        for obj in data:
            if obj.get('name') == name and obj.get('url') == url and obj.get('date') == today_date:
                obj['content'] = current_content
                updated = True
                break

        # If no existing object was updated, append the new object
        if not updated:
            data.append({
                'name': name,
                'url': url,
                'date': today_date,
                'content': current_content
            })

        # Write the updated data back to the file
        with open(file_path, 'w') as file:
            json.dump(data, file, indent=4)

    def _send_notification(self, website):
        
        # subject = f"Content change detected for {website}"
        # body = f"There has been a change in the content of {website}. Please check it."
        # email_content = f"<p>Changes detected on <a href='{url}'>{url}</a>:</p><p>{summary}</p>"
        pass