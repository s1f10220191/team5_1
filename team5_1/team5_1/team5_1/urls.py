o
    ��!g�  �                   @   s\   d Z ddlmZ ddlmZ edejdd�edejdd�ed	ejd
d�edejdd�gZ	dS )a~  
URL configuration for team5_1 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
�    )�path)�views� �index)�namezstages/�stageszstage/<int:stage_number>/�stage_templatezchat/�chatN)
�__doc__�django.urlsr   �	algostudyr   r   r   r   r	   �urlpatterns� r   r   �+/home/iniad/team5_1/team5_1/team5_1/urls.py�<module>   s    �