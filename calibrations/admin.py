from django.contrib import admin

from .models import CalibrationValue, Feature, Release, Variable


class CalibrationValueInline(admin.TabularInline):
	model = CalibrationValue
	extra = 0
	fields = (
		"release",
		"valor",
		"status_madurez",
		"verificacion",
		"notas",
	)
	ordering = ("release__fecha",)


@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
	list_display = ("codigo", "nombre", "descripcion", "updated_at")
	search_fields = ("codigo", "nombre", "descripcion")
	list_filter = ("created_at", "updated_at")


@admin.register(Variable)
class VariableAdmin(admin.ModelAdmin):
	list_display = (
		"nombre",
		"feature",
		"unidad",
		"responsable",
		"dimension_type",
		"updated_at",
	)
	search_fields = (
		"nombre",
		"descripcion",
		"feature__codigo",
		"feature__nombre",
	)
	list_filter = ("feature", "responsable", "dimension_type", "updated_at")
	inlines = [CalibrationValueInline]


@admin.register(Release)
class ReleaseAdmin(admin.ModelAdmin):
	list_display = ("nombre", "fecha", "descripcion", "updated_at")
	search_fields = ("nombre", "descripcion")
	list_filter = ("fecha", "created_at", "updated_at")


@admin.register(CalibrationValue)
class CalibrationValueAdmin(admin.ModelAdmin):
	list_display = (
		"variable",
		"release",
		"valor",
		"status_madurez",
		"verificacion",
		"updated_at",
	)
	search_fields = (
		"variable__nombre",
		"variable__feature__codigo",
		"release__nombre",
		"notas",
	)
	list_filter = ("status_madurez", "verificacion", "release", "updated_at")
