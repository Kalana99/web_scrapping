from utils.ExcelReader import ExcelReader
from utils.ApifyClientHelper import ApifyClientHelper

class NewsScanner:
    
    def __init__(self):
        
        self.news_list = []
        self.apify_client_helper = ApifyClientHelper()
        (self.names, self.clients) = ExcelReader.read_excel_file("utils/news.xlsx")

    def scan_news(self):

        for client in self.clients[:2]:
            
            response = self.search_endpoint(client)

            print(response)
        else:
            print("No news found.")
            
    def scan_single_news(self, client_name):
            
        response = self.search_endpoint(client_name)
        return response
            
    def search_endpoint(self, client_name):
        
        response = self.apify_client_helper.run_actor(client_name)
        return response
    
    # def prepare_email(self):
        
    #     # Parse the HTML content of the response
    #     soup = BeautifulSoup(response.content, "html.parser")
    #     articles = soup.find_all("article")

    #     if len(articles) > 0:
            
    #         email_content = ""
            
    #         for article in articles:
                
    #             headline = article.find("h3").text.strip()
    #             subheading = article.find("p").text.strip()
    #             link = article.find("a")["href"]
                
    #             email_content += f"Headline: {headline}\n"
    #             email_content += f"Subheading: {subheading}\n"
    #             email_content += f"Link: {link}\n\n"
    