from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("users.urls")),
    path("api/", include("patients.urls")),
    path("api/", include("content.urls")),
    path("api/calculators/", include("calculators.urls")),
]

