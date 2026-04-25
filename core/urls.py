from django.urls import path
from django.views.generic import RedirectView

urlpatterns = [
    path("", RedirectView.as_view(url="/calibrations/dashboard/", permanent=False), name="home"),
]
