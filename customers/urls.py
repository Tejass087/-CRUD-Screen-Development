from django.urls import path
from .views import students_api

urlpatterns = [
    path('api/students/', students_api, name='students_api'),
]
