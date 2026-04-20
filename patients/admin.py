from django.contrib import admin
from .models import Patient


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "email", "phone", "birth_date", "is_active", "created_at"]
    list_filter = ["is_active"]
    search_fields = ["first_name", "last_name", "email", "phone"]
