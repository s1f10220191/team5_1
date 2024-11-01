
from django.urls import path
from algostudy import views

urlpatterns = [
    path('', views.index, name='index'),
    path('stages/', views.stages, name='stages'),
    path('stage/<int:stage_number>/', views.stage_template, name='stage_template'),
    path('chat/', views.chat, name='chat'),
    path('S1/', views.s1_view, name="S1"),
]