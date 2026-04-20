from django.db import models


class Feature(models.Model):
    """Agrupación funcional de variables (F1, F2, F3...)."""
    code = models.CharField(max_length=20, unique=True, verbose_name="Código")
    name = models.CharField(max_length=200, verbose_name="Nombre")
    description = models.TextField(blank=True, verbose_name="Descripción")

    class Meta:
        ordering = ["code"]
        verbose_name = "Feature"
        verbose_name_plural = "Features"

    def __str__(self):
        return f"{self.code} – {self.name}"


class Variable(models.Model):
    """Variable de calibración asociada a una feature."""
    name = models.CharField(max_length=200, verbose_name="Nombre")
    feature = models.ForeignKey(
        Feature,
        on_delete=models.PROTECT,
        related_name="variables",
        verbose_name="Feature",
    )
    unit = models.CharField(max_length=50, blank=True, verbose_name="Unidad")
    description = models.TextField(blank=True, verbose_name="Descripción")

    class Meta:
        ordering = ["feature", "name"]
        verbose_name = "Variable"
        verbose_name_plural = "Variables"

    def __str__(self):
        return f"{self.feature.code} / {self.name}"


class Release(models.Model):
    """Versión o entrega del proyecto de calibración."""
    number = models.CharField(max_length=50, unique=True, verbose_name="Número de release")
    date = models.DateField(verbose_name="Fecha")
    notes = models.TextField(blank=True, verbose_name="Notas")

    class Meta:
        ordering = ["-date"]
        verbose_name = "Release"
        verbose_name_plural = "Releases"

    def __str__(self):
        return f"Release {self.number} ({self.date})"


class CalibrationValue(models.Model):
    """Valor de calibración de una variable en un release concreto."""

    class Maturity(models.TextChoices):
        INITIAL = "0.25", "25 % – Inicial"
        DEVELOPMENT = "0.50", "50 % – En desarrollo"
        ADVANCED = "0.75", "75 % – Avanzado"
        FINAL = "1.00", "100 % – Final"

    variable = models.ForeignKey(
        Variable,
        on_delete=models.PROTECT,
        related_name="calibration_values",
        verbose_name="Variable",
    )
    release = models.ForeignKey(
        Release,
        on_delete=models.PROTECT,
        related_name="calibration_values",
        verbose_name="Release",
    )
    value = models.DecimalField(max_digits=20, decimal_places=6, verbose_name="Valor")
    maturity = models.CharField(
        max_length=4,
        choices=Maturity.choices,
        default=Maturity.INITIAL,
        verbose_name="Madurez",
    )
    verified = models.BooleanField(default=False, verbose_name="Verificado")
    responsible = models.CharField(max_length=150, blank=True, verbose_name="Responsable")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última actualización")

    class Meta:
        unique_together = [("variable", "release")]
        ordering = ["release", "variable"]
        verbose_name = "Valor de calibración"
        verbose_name_plural = "Valores de calibración"

    def __str__(self):
        return f"{self.variable} @ {self.release.number} = {self.value}"

