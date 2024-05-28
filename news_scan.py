import smtplib
from email.mime.text import MIMEText
import requests
from excel import read_excel_file

clients = []

# NewsAPI configuration
NEWS_API_KEY = 'your_news_api_key'
NEWS_ENDPOINT = 'https://newsapi.org/v2/everything'

# Email configuration
EMAIL_HOST = 'smtp.your-email-provider.com'
EMAIL_PORT = 587
EMAIL_USER = 'your-email@example.com'
EMAIL_PASS = 'your-email-password'
TO_EMAIL = 'hello@finsed.com'


def search_news(client_name):
    params = {
        'q': client_name,
        'apiKey': NEWS_API_KEY
    }
    response = requests.get(NEWS_ENDPOINT, params=params)
    return response.json()

def send_email(content):
    msg = MIMEText(content, 'html')
    msg['Subject'] = 'Clients in the news'
    msg['From'] = EMAIL_USER
    msg['To'] = TO_EMAIL

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, TO_EMAIL, msg.as_string())

def main():

    clients = read_excel_file("news.xlsx")
    email_content = "<p>Hello,</p><p>Here are the latest news updates for our clients:</p>"

    for client in clients:
        news = search_news(client)
        if news['status'] == 'ok' and news['totalResults'] > 0:
            for article in news['articles'][:1]: 
                email_content += f"<p><b>{client}</b><br>"
                email_content += f"<b>Headline:</b> {article['title']}<br>"
                email_content += f"<b>Summary:</b> {article['description']}<br>"
                email_content += f"<b>Link:</b> <a href='{article['url']}'>{article['url']}</a></p>"

    if "<p><b>" in email_content:
        email_content += "<p>Best regards,<br>Your Company Name</p>"
        send_email(email_content)

if __name__ == "__main__":
    main()
