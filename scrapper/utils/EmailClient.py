import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import scrapper.settings as settings


# msg['Subject'] = 'Clients in the news'
# msg['Subject'] = 'Website Content Changes Detected'

class EmailClient:
    
    def __init__(self):
        self.sender_email = settings.EMAIL_HOST_USER
        self.sender_password = settings.EMAIL_HOST_PASSWORD
        self.smtp_server = settings.EMAIL_HOST
        self.smtp_port = settings.EMAIL_PORT
        self.to_email = settings.TO_EMAIL

    def send_email(self, subject, message):
        
        try:
            # Create a multipart message
            msg = MIMEText(message, 'html')
            msg['Subject'] = subject
            msg['From'] = settings.EMAIL_HOST_USER
            msg['To'] = settings.TO_EMAIL

            with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
                
                server.starttls()
                server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
                server.sendmail(settings.EMAIL_HOST_USER, settings.TO_EMAIL, msg.as_string())
                
                print("Email sent successfully!")
                
        except Exception as e:
            print(f"An error occurred while sending the email: {str(e)}")
            return Exception(f"An error occurred while sending the email: {str(e)}")
