from django.urls import path

from . import views

app_name = "calibrations"

urlpatterns = [
	path("dashboard/", views.dashboard, name="dashboard"),
	path("import/", views.import_view, name="import"),
	path("features/", views.feature_list, name="feature_list"),
	path("variables/", views.variable_list, name="variable_list"),
	path("variables/<int:pk>/", views.variable_detail, name="variable_detail"),
	path("variables/<int:pk>/map/", views.map_viewer, name="map_viewer"),
	path("variables/<int:pk>/map-data/", views.map_data_api, name="map_data_api"),
	path("releases/", views.release_list, name="release_list"),
	path("releases/<int:pk>/", views.release_detail, name="release_detail"),
]
