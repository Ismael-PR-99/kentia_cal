from django.db import models


class Feature(models.Model):
	codigo = models.CharField(max_length=20, unique=True)
	nombre = models.CharField(max_length=120)
	descripcion = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["codigo", "nombre"]

	def __str__(self) -> str:
		return f"{self.codigo} - {self.nombre}"


class Variable(models.Model):
	class Responsible(models.TextChoices):
		SUPPLIER = "Supplier", "Supplier"
		OEM = "OEM", "OEM"

	class DimensionType(models.TextChoices):
		SCALAR_1X1 = "1x1", "1x1"
		ARRAY_1XN = "1xn", "1xn"
		ARRAY_NX1 = "nx1", "nx1"
		ARRAY_NXN = "nxn", "nxn"

	feature = models.ForeignKey(
		Feature,
		on_delete=models.CASCADE,
		related_name="variables",
	)
	nombre = models.CharField(max_length=120)
	descripcion = models.TextField(blank=True)
	unidad = models.CharField(max_length=40, blank=True)
	responsable = models.CharField(
		max_length=20,
		choices=Responsible.choices,
	)
	dimension_type = models.CharField(
		max_length=3,
		choices=DimensionType.choices,
		default=DimensionType.SCALAR_1X1,
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["feature__codigo", "nombre"]
		constraints = [
			models.UniqueConstraint(
				fields=["feature", "nombre"],
				name="unique_variable_nombre_per_feature",
			)
		]

	def __str__(self) -> str:
		return f"{self.feature.codigo} - {self.nombre}"


class Release(models.Model):
	nombre = models.CharField(max_length=100, unique=True)
	fecha = models.DateField()
	descripcion = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-fecha", "nombre"]

	def __str__(self) -> str:
		return self.nombre


class CalibrationValue(models.Model):
	class MaturityStatus(models.TextChoices):
		INITIAL = "0.25", "0.25 - Inicial"
		TEST_BENCH = "0.5", "0.5 - Test bench"
		VEHICLE = "0.75", "0.75 - Vehicle"
		HOMOLOGATION = "1.0", "1.0 - Homologation"

	class VerificationType(models.TextChoices):
		NONE = "No", "No"
		TEST_BENCH = "Test bench", "Test bench"
		VEHICLE = "Vehicle", "Vehicle"
		HOMOLOGATION = "Homologation", "Homologation"

	variable = models.ForeignKey(
		Variable,
		on_delete=models.CASCADE,
		related_name="calibration_values",
	)
	release = models.ForeignKey(
		Release,
		on_delete=models.CASCADE,
		related_name="calibration_values",
	)
	# For 1x1 store a number, for array dimensions store a list/matrix.
	valor = models.JSONField()
	status_madurez = models.CharField(
		max_length=4,
		choices=MaturityStatus.choices,
	)
	verificacion = models.CharField(
		max_length=20,
		choices=VerificationType.choices,
	)
	notas = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["release__fecha", "variable__nombre"]
		constraints = [
			models.UniqueConstraint(
				fields=["variable", "release"],
				name="unique_variable_release_calibration_value",
			)
		]

	def __str__(self) -> str:
		return f"{self.variable.nombre} @ {self.release.nombre}"
