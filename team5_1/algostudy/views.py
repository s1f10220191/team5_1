# views.py
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

def s1_view(request):
    return render(request, "algostudy/S1.html")

# OpenAI APIキーとベースURLを直接設定
openai.api_key = "###"  # ここにあなたのAPIキーを入力してください
openai.api_base = "https://api.openai.iniad.org/api/v1"

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        # リクエストからユーザーのメッセージを取得
        data = json.loads(request.body)
        message = data.get('message', '')

        # OpenAI APIを使用して応答を生成
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "あなたは役に立つアシスタントです。"},
                    {"role": "user", "content": message},
                ],
                max_tokens=150,
                temperature=0.7,
            )
            reply = response.choices[0].message.content.strip()
        except Exception as e:
            reply = "エラーが発生しました。もう一度お試しください。"

        # 応答をJSONで返す
        return JsonResponse({'reply': reply})
    else:
        return JsonResponse({'error': '無効なリクエストです。'}, status=400)
