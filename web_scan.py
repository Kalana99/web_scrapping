import requests
from bs4 import BeautifulSoup
import smtplib
from email.mime.text import MIMEText
import difflib
import openai
from excel import read_excel_file

websites = []

# Email configuration
EMAIL_HOST = 'smtp.your-email-provider.com'
EMAIL_PORT = 587
EMAIL_USER = 'your-email@example.com'
EMAIL_PASS = 'your-email-password'
TO_EMAIL = 'hello@finsed.com'

# OpenAI API key
OPENAI_API_KEY = 'your_openai_api_key'

# Function to fetch website content
def fetch_content(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    # Extract text content excluding design elements
    texts = soup.find_all(['p', 'h1', 'h2', 'h3'])
    content = ' '.join([text.get_text() for text in texts])
    return content

# Function to send email
def send_email(content):
    msg = MIMEText(content, 'html')
    msg['Subject'] = 'Website Content Changes Detected'
    msg['From'] = EMAIL_USER
    msg['To'] = TO_EMAIL

    with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, TO_EMAIL, msg.as_string())

# Function to summarize changes using GPT-4
def summarize_changes(changes):
    openai.api_key = OPENAI_API_KEY
    response = openai.Completion.create(
        model="gpt-4",
        prompt=f"Summarize the following changes:\n\n{changes}",
        max_tokens=150
    )
    return response.choices[0].text.strip()

def main():

    websites = read_excel_file("web.xlsx")

    for url in websites:

        current_content = fetch_content(url)

        # Load previous content if available
        try:
            with open(f"{url.replace('https://', '').replace('/', '_')}.txt", 'r') as file:
                previous_content = file.read()
        except FileNotFoundError:
            previous_content = ""

        # Compare contents
        if current_content != previous_content:
            
            # Generate a diff of the changes
            diff = difflib.ndiff(previous_content.splitlines(), current_content.splitlines())
            changes = '\n'.join(diff)
            
            # Summarize changes
            summary = summarize_changes(changes)
            
            # Email the summary
            email_content = f"<p>Changes detected on <a href='{url}'>{url}</a>:</p><p>{summary}</p>"
            send_email(email_content)
            
            # Save the current content for future comparison
            with open(f"{url.replace('https://', '').replace('/', '_')}.txt", 'w') as file:
                file.write(current_content)

if __name__ == "__main__":
    main()
