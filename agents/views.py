from django.conf import settings
from django.shortcuts import get_object_or_404, render

from calibrations.models import Release, Variable

from .services import CalibrationAnalystAgent, ReleaseReviewAgent


def variable_analyze(request, pk):
    """Muestra o ejecuta el análisis de una variable con el agente de calibración."""
    variable = get_object_or_404(Variable.objects.select_related("feature"), pk=pk)
    base_context = {
        "type": "variable",
        "variable": variable,
    }

    if not settings.ANTHROPIC_API_KEY.strip():
        return render(
            request,
            "agents/analyze_result.html",
            {
                **base_context,
                "success": False,
                "error": "ANTHROPIC_API_KEY no está configurada. Configúrala en el entorno para ejecutar el análisis.",
            },
        )

    if request.method != "POST":
        return render(
            request,
            "agents/analyze_result.html",
            {
                **base_context,
                "success": None,
            },
        )

    try:
        agent = CalibrationAnalystAgent()
        result = agent.analyze(variable.id)
    except Exception as error:
        return render(
            request,
            "agents/analyze_result.html",
            {
                **base_context,
                "success": False,
                "error": f"No se pudo ejecutar el análisis: {error}",
            },
        )

    if not result.get("success"):
        return render(
            request,
            "agents/analyze_result.html",
            {
                **base_context,
                "success": False,
                "error": result.get("error"),
            },
        )

    return render(
        request,
        "agents/analyze_result.html",
        {
            **base_context,
            "success": True,
            "analysis": result["analysis"],
        },
    )


def release_review(request, pk):
    """Muestra o ejecuta la revisión de un release con el agente de revisión."""
    release = get_object_or_404(Release, pk=pk)
    base_context = {
        "type": "release",
        "release": release,
    }

    if not settings.ANTHROPIC_API_KEY.strip():
        return render(
            request,
            "agents/analyze_result.html",
            {
                **base_context,
                "success": False,
                "error": "ANTHROPIC_API_KEY no está configurada. Configúrala en el entorno para ejecutar la revisión.",
            },
        )

    if request.method != "POST":
        return render(
            request,
            "agents/analyze_result.html",
            {
                **base_context,
                "success": None,
            },
        )

    try:
        agent = ReleaseReviewAgent()
        result = agent.analyze(release.id)
    except Exception as error:
        return render(
            request,
            "agents/analyze_result.html",
            {
                **base_context,
                "success": False,
                "error": f"No se pudo ejecutar la revisión: {error}",
            },
        )

    if not result.get("success"):
        return render(
            request,
            "agents/analyze_result.html",
            {
                **base_context,
                "success": False,
                "error": result.get("error"),
            },
        )

    return render(
        request,
        "agents/analyze_result.html",
        {
            **base_context,
            "success": True,
            "summary": result["summary"],
            "review": result["review"],
        },
    )
