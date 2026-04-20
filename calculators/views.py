from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status


class BMICalculatorView(APIView):
    """
    Calculadora de Índice de Masa Corporal (IMC).
    Pública, sin autenticación.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        weight = request.data.get("weight")  # kg
        height = request.data.get("height")  # metros

        if not weight or not height:
            return Response(
                {"error": "Se requieren 'weight' (kg) y 'height' (m)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            weight = float(weight)
            height = float(height)
            
            if weight <= 0 or height <= 0:
                raise ValueError("Los valores deben ser positivos")
            
            bmi = weight / (height ** 2)
            
            # Clasificación según OMS
            if bmi < 18.5:
                category = "Bajo peso"
                recommendation = "Considera consultar con un nutricionista"
            elif 18.5 <= bmi < 25:
                category = "Peso normal"
                recommendation = "Mantén tus hábitos saludables"
            elif 25 <= bmi < 30:
                category = "Sobrepeso"
                recommendation = "Considera mejorar dieta y aumentar actividad física"
            else:
                category = "Obesidad"
                recommendation = "Consulta con un profesional de la salud"

            return Response({
                "bmi": round(bmi, 2),
                "category": category,
                "recommendation": recommendation,
                "disclaimer": "Esta es una herramienta orientativa. Consulta con un profesional de la salud."
            })

        except (ValueError, TypeError) as e:
            return Response(
                {"error": "Valores inválidos"},
                status=status.HTTP_400_BAD_REQUEST
            )


class CalorieCalculatorView(APIView):
    """
    Calculadora de calorías diarias estimadas (Fórmula Harris-Benedict).
    Pública, sin autenticación.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        weight = request.data.get("weight")  # kg
        height = request.data.get("height")  # cm
        age = request.data.get("age")  # años
        gender = request.data.get("gender")  # "male" o "female"
        activity = request.data.get("activity", "sedentary")  # nivel de actividad

        if not all([weight, height, age, gender]):
            return Response(
                {"error": "Se requieren: weight (kg), height (cm), age, gender (male/female)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            weight = float(weight)
            height = float(height)
            age = int(age)

            # Fórmula Harris-Benedict revisada
            if gender.lower() == "male":
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
            elif gender.lower() == "female":
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
            else:
                return Response(
                    {"error": "Gender debe ser 'male' o 'female'"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Multiplicadores por nivel de actividad
            activity_factors = {
                "sedentary": 1.2,      # Poco o ningún ejercicio
                "light": 1.375,        # Ejercicio ligero 1-3 días/semana
                "moderate": 1.55,      # Ejercicio moderado 3-5 días/semana
                "active": 1.725,       # Ejercicio intenso 6-7 días/semana
                "very_active": 1.9     # Ejercicio muy intenso o trabajo físico
            }

            factor = activity_factors.get(activity.lower(), 1.2)
            daily_calories = bmr * factor

            return Response({
                "bmr": round(bmr, 0),
                "daily_calories": round(daily_calories, 0),
                "activity_level": activity,
                "recommendations": {
                    "weight_loss": round(daily_calories - 500, 0),
                    "maintenance": round(daily_calories, 0),
                    "weight_gain": round(daily_calories + 500, 0)
                },
                "disclaimer": "Estas son estimaciones generales. Consulta con un nutricionista para un plan personalizado."
            })

        except (ValueError, TypeError):
            return Response(
                {"error": "Valores inválidos"},
                status=status.HTTP_400_BAD_REQUEST
            )


class WaterIntakeCalculatorView(APIView):
    """
    Calculadora de ingesta diaria de agua recomendada.
    Pública, sin autenticación.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        weight = request.data.get("weight")  # kg
        activity = request.data.get("activity", "moderate")  # low, moderate, high
        climate = request.data.get("climate", "temperate")  # cold, temperate, hot

        if not weight:
            return Response(
                {"error": "Se requiere 'weight' (kg)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            weight = float(weight)
            
            # Fórmula base: 30-35 ml por kg de peso
            base_water = weight * 0.033  # litros

            # Ajuste por actividad física
            activity_multipliers = {
                "low": 1.0,
                "moderate": 1.2,
                "high": 1.5
            }

            # Ajuste por clima
            climate_multipliers = {
                "cold": 0.9,
                "temperate": 1.0,
                "hot": 1.3
            }

            activity_factor = activity_multipliers.get(activity.lower(), 1.0)
            climate_factor = climate_multipliers.get(climate.lower(), 1.0)

            total_water = base_water * activity_factor * climate_factor

            # Convertir a vasos (250ml cada uno)
            glasses = total_water / 0.25

            return Response({
                "daily_water_liters": round(total_water, 2),
                "daily_water_ml": round(total_water * 1000, 0),
                "glasses_250ml": round(glasses, 0),
                "recommendations": {
                    "morning": round(glasses * 0.3, 0),
                    "afternoon": round(glasses * 0.4, 0),
                    "evening": round(glasses * 0.3, 0)
                },
                "tips": [
                    "Bebe agua al despertar para rehidratarte",
                    "Lleva una botella de agua contigo",
                    "Bebe antes de sentir sed"
                ],
                "disclaimer": "Esta es una recomendación general. Las necesidades varían según cada persona."
            })

        except (ValueError, TypeError):
            return Response(
                {"error": "Peso inválido"},
                status=status.HTTP_400_BAD_REQUEST
            )
