from django.shortcuts import render
import openai
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

def index(request):
    return render(request, 'algostudy/index.html')

def stages(request):
    return render(request, 'algostudy/stages.html')

def stage_template(request, stage_number):
    context = {'stage_number': stage_number}
    return render(request, 'algostudy/stage_template.html', context)

api_key = "89DR66YooENFUJia-v1Lc2cP0UOjCCMjTlpOv0QWKloFpOGDrAzXCfnyjbCYP6eTLYh0pJNiNT6Glv4KKFF_4Bw"
base_url = "https://api.openai.iniad.org/api/v1"  # ベースURLはOpenAIのデフォルトを使用します

client = openai.OpenAI(api_key=api_key, base_url=base_url)

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # JSONデータを解析
            user_input = data.get('message')
            if user_input:
                # OpenAIのAPI呼び出し
                response = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{'role': 'user', 'content': user_input}]
                )
                bot_response = response['choices'][0]['message']['content']
                return JsonResponse({'bot_response': bot_response})
            return JsonResponse({'error': 'メッセージがありません'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': '無効なリクエストフォーマット'}, status=400)
    return JsonResponse({'error': 'POSTリクエストが必要です'}, status=405)