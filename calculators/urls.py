from django.urls import path
from .views import BMICalculatorView, CalorieCalculatorView, WaterIntakeCalculatorView

urlpatterns = [
    path("bmi/", BMICalculatorView.as_view(), name="calculator_bmi"),
    path("calories/", CalorieCalculatorView.as_view(), name="calculator_calories"),
    path("water/", WaterIntakeCalculatorView.as_view(), name="calculator_water"),
]
