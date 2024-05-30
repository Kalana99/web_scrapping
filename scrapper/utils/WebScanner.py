import requests
from bs4 import BeautifulSoup
import difflib
import hashlib
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
            
            changes = self._get_changes(current_content, previous_content)
            summary = self._summarize_changes(changes)
            
            self._save_current_content(name, current_content, summary.message.content)
            
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
        
        changes = self._get_changes(text1, text2)
        summary = self._summarize_changes(changes)
        
        return summary.message.content

    def _fetch_current_content(self, url):
        
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract text content excluding design elements
        texts = soup.find_all(['p', 'h1', 'h2', 'h3'])
        content = ' '.join([text.get_text() for text in texts])
        
        return content
    
    def _load_previous_content(self, name):
        
        try:
            with open(f"utils/web/current/{name}.txt", 'r') as file:
                previous_content = file.read()
                return previous_content
        except FileNotFoundError:
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

    def _save_current_content(self, name, current_content, summary_content):
        
        with open(f"utils/web/current/{name}.txt", 'w') as file:
            file.write(current_content)
                
        with open(f"utils/web/result/{name}-result.txt", 'w') as file:
            file.write(summary_content)

    def _send_notification(self, website):
        
        # subject = f"Content change detected for {website}"
        # body = f"There has been a change in the content of {website}. Please check it."
        # email_content = f"<p>Changes detected on <a href='{url}'>{url}</a>:</p><p>{summary}</p>"
        pass