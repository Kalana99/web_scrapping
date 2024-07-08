from rest_framework.decorators import api_view
from rest_framework.response import Response
from collections import defaultdict
from .models import NewsScanResult, WebsiteContent
from .serializers import NewsScanResultSerializer, WebsiteContentSerializer
from scheduler.tasks import fetch_news_for_names, check_website_changes, fetch_news_for_name, fetch_and_compare_website_content, fetch_and_compare_two_websites, compare_text

from utils.DBHelper import DBHelper

@api_view(['GET'])
def news_scan_results(request):
    
    results = fetch_news_for_names()
    
    if results != False:
        return Response({"message": "News scan completed", "results": results})
    return Response({"error": "News scan failed"}, status=400)

@api_view(['GET'])
def website_content(request):
    
    results = check_website_changes()
    
    if results != False:
        return Response({"message": "Website scan completed", "results": results})
    return Response({"error": "No changes detected"}, status=400)

@api_view(['POST'])
def single_news_scan(request):
    
    name = request.data.get('name')
    
    if name:
        
        news = fetch_news_for_name(name)
        return Response(news)
    
    return Response({"error": "Name is required"}, status=400)

@api_view(['POST'])
def single_website_scan(request):
    
    name = request.data.get('name')
    url = request.data.get('url')
    
    if name and url:
        
        changes = fetch_and_compare_website_content(name, url)
        return Response(changes)
    
    return Response({"error": "Name and URL are required"}, status=400)

@api_view(['POST'])
def text_compare(request):
    
    text1 = request.data.get('text1')
    text2 = request.data.get('text2')
    
    if text1 and text2:
        
        changes = compare_text(text1, text2)
        return Response({"diff": '\n'.join(changes)})
    
    return Response({"error": "Text1 and Text2 are required"}, status=400)

@api_view(['POST'])
def web_compare(request):
    
    url1 = request.data.get('url1')
    url2 = request.data.get('url2')
    
    if url1 and url2:
        
        changes = fetch_and_compare_two_websites(url1, url2)
        return Response(changes)
    
    return Response({"error": "URL1 and URL2 are required"}, status=400)

@api_view(['POST'])
def add_web_client(request):
    
    name = request.data.get('name')
    url = request.data.get('url')
    
    if name and url:
        
        result = DBHelper.add_web_client(name, url)
        
        if not result["error"]:
            return Response(result)
        return Response(result, status=400)
    
    return Response({"error": True, "message": "Name and URL are required"}, status=400)

@api_view(['POST'])
def add_web_clients(request):
    
    clients = convert_to_dict(request.data)
    
    if clients:
        
        result = DBHelper.add_web_clients(clients)
        
        return Response(result)
    
    return Response({"error": True, "message": "Clients are required"}, status=400)

@api_view(['POST'])
def add_news_client(request):
    
    name = request.data.get('name')
    
    if name:
        
        result = DBHelper.add_news_client(name)
        
        if not result["error"]:
            return Response(result)
        return Response(result, status=400)
    
    return Response({"error": True, "message": "Name is required"}, status=400)

@api_view(['POST'])
def add_news_clients(request):
    
    clients = convert_to_dict(request.data)
    
    if clients:
        
        result = DBHelper.add_news_clients(clients)
        return Response(result)
    
    return Response({"error": True, "message": "Clients are required"}, status=400)

@api_view(['GET'])
def get_web_clients(request):
    
    try: 
        clients = DBHelper.get_web_clients()
        return Response(clients)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def get_news_clients(request):
    
    try:
        clients = DBHelper.get_news_clients()
        return Response(clients)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=500)

def convert_to_dict(query_dict):
    
    dict_data = dict(query_dict.lists())

    # Group by index
    grouped_data = defaultdict(dict)
    
    for key, values in dict_data.items():
        
        if values:
            
            # Extract the index and the field name
            index = int(key.split('[')[1].split(']')[0])
            field = key.split('[')[2].split(']')[0]
            
            # Assign the value to the appropriate place in the grouped_data dictionary
            grouped_data[index][field] = values[0].strip()

    # Convert grouped_data to a list of dictionaries
    list_of_dicts = [grouped_data[index] for index in sorted(grouped_data.keys())]
    
    return list_of_dicts
