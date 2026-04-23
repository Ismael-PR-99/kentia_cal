from django.db.models import Count, Prefetch
from django.shortcuts import get_object_or_404, render

from .forms import ExcelImportForm
from .models import CalibrationValue, Feature, Release, Variable
from .services import import_from_excel


def dashboard(request):
	features_count = Feature.objects.count()
	variables_count = Variable.objects.count()
	releases_count = Release.objects.count()
	last_release = Release.objects.order_by("-fecha", "-id").first()

	homologated_variable_ids = CalibrationValue.objects.filter(
		status_madurez=CalibrationValue.MaturityStatus.HOMOLOGATION
	).values_list("variable_id", flat=True)
	variables_sin_homologar_qs = Variable.objects.exclude(
		id__in=homologated_variable_ids
	).select_related("feature")

	latest_changes = CalibrationValue.objects.select_related(
		"variable", "variable__feature", "release"
	).order_by("-updated_at")[:10]

	context = {
		"features_count": features_count,
		"variables_count": variables_count,
		"releases_count": releases_count,
		"last_release": last_release,
		"variables_sin_homologar_count": variables_sin_homologar_qs.count(),
		"variables_sin_homologar": variables_sin_homologar_qs,
		"latest_changes": latest_changes,
	}
	return render(request, "calibrations/dashboard.html", context)


def feature_list(request):
	features = Feature.objects.prefetch_related(
		Prefetch("variables", queryset=Variable.objects.order_by("nombre"))
	).annotate(variables_total=Count("variables"))

	context = {
		"features": features,
	}
	return render(request, "calibrations/features_list.html", context)


def variable_list(request):
	feature_id = request.GET.get("feature")
	responsable = request.GET.get("responsable")

	variables = Variable.objects.select_related("feature")

	if feature_id:
		variables = variables.filter(feature_id=feature_id)
	if responsable:
		variables = variables.filter(responsable=responsable)

	latest_release = Release.objects.order_by("-fecha", "-id").first()
	latest_values_by_variable_id = {}
	if latest_release:
		latest_values_by_variable_id = {
			cv.variable_id: cv
			for cv in CalibrationValue.objects.filter(release=latest_release)
		}

	variables_with_latest_status = [
		{
			"variable": variable,
			"latest_value": latest_values_by_variable_id.get(variable.id),
		}
		for variable in variables
	]

	features = Feature.objects.all()
	responsables = Variable.Responsible.choices

	context = {
		"variables_with_latest_status": variables_with_latest_status,
		"features": features,
		"responsables": responsables,
		"selected_feature": feature_id,
		"selected_responsable": responsable,
		"latest_release": latest_release,
	}
	return render(request, "calibrations/variables_list.html", context)


def variable_detail(request, pk):
	variable = get_object_or_404(
		Variable.objects.select_related("feature"),
		pk=pk,
	)

	calibration_values = CalibrationValue.objects.filter(variable=variable).select_related(
		"release"
	)
	values_by_release = {cv.release_id: cv for cv in calibration_values}

	releases = list(Release.objects.order_by("fecha", "id"))
	evolution_timeline = [
		{
			"release": release,
			"calibration_value": values_by_release.get(release.id),
		}
		for release in releases
	]

	context = {
		"variable": variable,
		"releases": releases,
		"evolution_timeline": evolution_timeline,
	}
	return render(request, "calibrations/variable_detail.html", context)


def release_list(request):
	releases = Release.objects.annotate(
		variables_total=Count("calibration_values__variable", distinct=True)
	)

	context = {
		"releases": releases,
	}
	return render(request, "calibrations/releases_list.html", context)


def release_detail(request, pk):
	release = get_object_or_404(Release, pk=pk)

	calibration_values = CalibrationValue.objects.filter(release=release).select_related(
		"variable", "variable__feature"
	)
	values_by_variable_id = {cv.variable_id: cv for cv in calibration_values}

	variables = Variable.objects.select_related("feature")
	variables_with_status = [
		{
			"variable": variable,
			"calibration_value": values_by_variable_id.get(variable.id),
		}
		for variable in variables
	]

	context = {
		"release": release,
		"variables_with_status": variables_with_status,
	}
	return render(request, "calibrations/release_detail.html", context)


def import_view(request):
	"""
	Handle Excel file upload and import calibration data.
	"""
	if request.method == "POST":
		form = ExcelImportForm(request.POST, request.FILES)
		if form.is_valid():
			file_obj = form.cleaned_data["file"]
			import_result = import_from_excel(file_obj)

			context = {
				"import_done": True,
				"result": import_result,
			}
			return render(request, "calibrations/import.html", context)
	else:
		form = ExcelImportForm()

	context = {
		"form": form,
		"import_done": False,
	}
	return render(request, "calibrations/import.html", context)
