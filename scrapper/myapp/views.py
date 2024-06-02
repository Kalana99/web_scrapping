from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import NewsScanResult, WebsiteContent
from .serializers import NewsScanResultSerializer, WebsiteContentSerializer
from scheduler.tasks import fetch_news_for_name, fetch_and_compare_website_content, fetch_and_compare_two_websites, compare_text

@api_view(['GET'])
def news_scan_results(request):
    results = NewsScanResult.objects.all()
    serializer = NewsScanResultSerializer(results, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def website_content(request):
    contents = WebsiteContent.objects.all()
    serializer = WebsiteContentSerializer(contents, many=True)
    return Response(serializer.data)

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
