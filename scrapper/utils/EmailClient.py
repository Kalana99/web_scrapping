import resend
import scrapper.settings as settings


class EmailClient:
    
    def __init__(self):
        
        self.to_email = ['Nash_peter@hotmail.com', 'tsliyan@hotmail.com', 'kalanarajika99@gmail.com']
        self.from_email = settings.DEFAULT_FROM_EMAIL
        self.key = settings.EMAIL_API_KEY
    
    def send_email(self, subject, body_html):
        
        try:
            resend.api_key = self.key
            
            response = resend.Emails.send({
                "from": self.from_email,
                "to": self.to_email,
                "subject": subject,
                "html": body_html
            })
            print(response)
            
            send_message = True
            
        except Exception as e:
            print(e)
            send_message = None
        
        return send_message
