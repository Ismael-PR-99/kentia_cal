import logging

import anthropic
from django.conf import settings

from calibrations.models import CalibrationValue, Release, Variable

logger = logging.getLogger(__name__)


class CalibrationAnalystAgent:
    """
    Analyzes a single Variable and its calibration evolution across releases.
    Uses Claude to generate insights on trends, maturity status, risks, and recommendations.
    """

    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not configured")
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def analyze(self, variable_id: int) -> dict:
        try:
            variable = Variable.objects.select_related("feature").get(id=variable_id)
        except Variable.DoesNotExist:
            return {
                "success": False,
                "error": f"Variable with ID {variable_id} not found",
            }

        calibration_values = CalibrationValue.objects.filter(variable=variable).select_related(
            "release"
        ).order_by("release__fecha")

        if not calibration_values.exists():
            return {
                "success": False,
                "error": f"No calibration values found for variable {variable.nombre}",
            }

        prompt = self._build_prompt(variable, calibration_values)

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            analysis_text = message.content[0].text

            return {
                "success": True,
                "variable": {
                    "id": variable.id,
                    "nombre": variable.nombre,
                    "feature": variable.feature.codigo,
                    "unidad": variable.unidad,
                },
                "analysis": analysis_text,
            }
        except anthropic.APIError as e:
            logger.error(f"Anthropic API error: {str(e)}")
            return {
                "success": False,
                "error": f"API error: {str(e)}",
            }

    def _build_prompt(self, variable: Variable, calibration_values) -> str:
        evolution_data = "\n".join(
            [
                f"- {cv.release.nombre}: valor={cv.valor}, madurez={cv.status_madurez}, verificacion={cv.verificacion}"
                for cv in calibration_values
            ]
        )

        prompt = f"""
Analiza la evolución de calibración de la siguiente variable automotriz ECU/software embebido:

Variable: {variable.nombre}
Feature: {variable.feature.codigo}
Unidad: {variable.unidad}
Responsable: {variable.responsable}
Descripción: {variable.descripcion or "N/A"}

Evolución por release:
{evolution_data}

Proporciona un análisis que incluya:
1. Tendencia del valor (aumenta, disminuye, estable)
2. Estado de madurez (0.25=inicial, 0.5=test bench, 0.75=vehicle, 1.0=homologation)
3. Riesgos identificados
4. Recomendaciones para próximos pasos

Sé conciso y profesional.
"""
        return prompt.strip()


class ReleaseReviewAgent:
    """
    Reviews a Release and provides a summary of its calibration status.
    Identifies at-risk variables and provides executive summary.
    """

    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY
        if not self.api_key:
            raise ValueError("ANTHROPIC_API_KEY not configured")
        self.client = anthropic.Anthropic(api_key=self.api_key)

    def analyze(self, release_id: int) -> dict:
        try:
            release = Release.objects.get(id=release_id)
        except Release.DoesNotExist:
            return {
                "success": False,
                "error": f"Release with ID {release_id} not found",
            }

        calibration_values = CalibrationValue.objects.filter(release=release).select_related(
            "variable", "variable__feature"
        )

        if not calibration_values.exists():
            return {
                "success": False,
                "error": f"No calibration values found for release {release.nombre}",
            }

        prompt = self._build_prompt(release, calibration_values)

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}],
            )
            analysis_text = message.content[0].text

            return {
                "success": True,
                "release": {
                    "id": release.id,
                    "nombre": release.nombre,
                    "fecha": release.fecha.isoformat(),
                },
                "summary": self._count_by_status(calibration_values),
                "review": analysis_text,
            }
        except anthropic.APIError as e:
            logger.error(f"Anthropic API error: {str(e)}")
            return {
                "success": False,
                "error": f"API error: {str(e)}",
            }

    def _build_prompt(self, release: Release, calibration_values) -> str:
        variables_data = "\n".join(
            [
                f"- {cv.variable.feature.codigo}/{cv.variable.nombre}: madurez={cv.status_madurez}, verificacion={cv.verificacion}"
                for cv in calibration_values
            ]
        )

        at_risk = calibration_values.filter(
            status_madurez__in=["0.25", "0.5"]
        ).count()
        homologated = calibration_values.filter(
            status_madurez="1.0"
        ).count()

        prompt = f"""
Realiza una revisión de release del siguiente proyecto de calibración automotriz:

Release: {release.nombre}
Fecha: {release.fecha.isoformat()}
Descripción: {release.descripcion or "N/A"}

Total de variables calibradas: {calibration_values.count()}
- Homologadas (1.0): {homologated}
- En riesgo (0.25/0.5): {at_risk}

Variables por madurez:
{variables_data}

Proporciona:
1. Resumen ejecutivo del estado del release
2. Variables en riesgo y por qué
3. Variables OK y preparadas
4. Recomendaciones para el próximo release
5. Riesgos globales

Sé conciso pero exhaustivo.
"""
        return prompt.strip()

    def _count_by_status(self, calibration_values) -> dict:
        return {
            "total": calibration_values.count(),
            "initial": calibration_values.filter(status_madurez="0.25").count(),
            "test_bench": calibration_values.filter(status_madurez="0.5").count(),
            "vehicle": calibration_values.filter(status_madurez="0.75").count(),
            "homologation": calibration_values.filter(status_madurez="1.0").count(),
        }
