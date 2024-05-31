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
        previous_content = self._load_previous_content(name)
        
        if current_content != previous_content:
            
            summary = self._summarize_diff(previous_content, current_content)
            
            self._save_current_content(name, url, current_content)
            
            return ({
                "name": name,
                "url": url,
                "summary": summary.message.content
            }, current_content)
        else:
            print(f"No change detected for {name}")
            return ({
                "name": name,
                "url": url,
                "summary": "No changes detected"
            }, current_content)
        
    def compare_text(self, text1, text2):
        
        summary  = self._summarize_diff(text1, text2)
        
        return summary.message.content

    def _fetch_current_content(self, url):
        
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract text content excluding design elements
        texts = soup.find_all(['p', 'h1', 'h2', 'h3'])
        content = ' '.join([text.get_text() for text in texts])
        
        return content
    
    def _load_previous_content(self, name):
        
        file_path = "utils/web/current/content.json"
        
        try:
            with open(file_path, 'r') as file:
                try:
                    data = json.load(file)
                except json.JSONDecodeError:
                    data = []
        except FileNotFoundError:
            data = []

        for obj in data:
            if obj.get('name') == name:
                return obj.get('content', "")
        
        return ""
        
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

    def _save_current_content(self, name, url, current_content):
        
        file_path = "utils/web/current/content.json"

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
            if obj.get('name') == name and obj.get('url') == url:
                obj['content'] = current_content
                updated = True
                break

        # If no existing object was updated, append the new object
        if not updated:
            data.append({
                'name': name,
                'url': url,
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