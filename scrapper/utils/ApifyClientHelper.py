from apify_client import ApifyClient
import scrapper.settings as settings


class ApifyClientHelper:
    
    def __init__(self):
        
        self.client = ApifyClient(token=settings.NEWS_API_KEY)
        self.items = []
        
    def run_actor(self, query):
        
        run_input = {
            "site": "cnn.com",
            "query": query,
            "sort": "date",
            "maxItems": 5,
            "proxy": { "useApifyProxy": True },
        }
        
        run = self.client.actor("X81PxOydfbSEcYmNx").call(run_input=run_input)
        
        for item in self.client.dataset(run["defaultDatasetId"]).iterate_items():
            print(item)
            self.items.append(item)
            
        return self.items
