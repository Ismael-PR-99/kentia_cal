from django.urls import path

from . import views

app_name = "agents"

urlpatterns = [
    path("variable/<int:pk>/analyze/", views.variable_analyze, name="variable_analyze"),
    path("release/<int:pk>/review/", views.release_review, name="release_review"),
]
