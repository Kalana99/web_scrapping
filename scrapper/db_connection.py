import pymongo
import scrapper.settings as settings

client = pymongo.MongoClient(settings.DB_CONN)
db = client[settings.DB_NAME]
