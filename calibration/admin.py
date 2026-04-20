from django.contrib import admin
from .models import Feature, Variable, Release, CalibrationValue


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "description"]
    search_fields = ["code", "name"]
    ordering = ["code"]


@admin.register(Variable)
class VariableAdmin(admin.ModelAdmin):
    list_display = ["name", "feature", "unit", "description"]
    list_filter = ["feature"]
    search_fields = ["name", "feature__code"]
    ordering = ["feature", "name"]


@admin.register(Release)
class ReleaseAdmin(admin.ModelAdmin):
    list_display = ["number", "date", "notes"]
    ordering = ["-date"]


@admin.register(CalibrationValue)
class CalibrationValueAdmin(admin.ModelAdmin):
    list_display = ["variable", "release", "value", "maturity", "verified", "responsible", "updated_at"]
    list_filter = ["release", "maturity", "verified", "variable__feature"]
    search_fields = ["variable__name", "responsible"]
    ordering = ["release", "variable"]
