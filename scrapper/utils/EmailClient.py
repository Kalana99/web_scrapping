import os
import json
import base64
from email.mime.text import MIMEText
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import scrapper.settings as settings


# msg['Subject'] = 'Clients in the news'
# msg['Subject'] = 'Website Content Changes Detected'

SCOPES = ['https://www.googleapis.com/auth/gmail.send']

class EmailClient:
    
    def __init__(self):
        
        self.sender_email = settings.EMAIL_HOST_USER
        self.sender_password = settings.EMAIL_HOST_PASSWORD
        self.smtp_server = settings.EMAIL_HOST
        self.smtp_port = settings.EMAIL_PORT
        self.to_email = settings.TO_EMAIL
        
        self.token_path = "scrapper/utils/token.json"
        self.cred_path = "scrapper/utils/credentials.json"
        
        self.creds = None
        self.scopes = SCOPES
        

    def get_gmail_service(self):
        
        if os.path.exists(self.token_path):
            self.creds = Credentials.from_authorized_user_file(self.token_path, self.scopes)
            
        if not self.creds or not self.creds.valid:
            
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(self.cred_path, self.scopes)
                self.creds = flow.run_local_server(port=0)

            with open(self.token_path, 'w') as token:
                json.dump(self.creds.to_json(), token, indent=4)
                
        service = build('gmail', 'v1', credentials=self.creds)
        
        return service

    def send_email(self, subject, body_html, to):
        
        service = self.get_gmail_service()
        
        message = MIMEText(body_html, 'html')
        message['to'] = to
        message['from'] = settings.DEFAULT_FROM_EMAIL
        message['subject'] = subject
        
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        message = {'raw': raw_message}
        
        send_message = service.users().messages().send(userId='me', body=message).execute()
        
        return send_message
