from django.conf import settings
from django.shortcuts import get_object_or_404, render

from calibrations.models import Release, Variable
from .services import CalibrationAnalystAgent, ReleaseReviewAgent


def variable_analyze(request, pk):
    variable = get_object_or_404(
        Variable.objects.select_related("feature"), pk=pk
    )

    if not settings.ANTHROPIC_API_KEY:
        return render(request, "agents/analyze_result.html", {
            "success": False,
            "error": "ANTHROPIC_API_KEY no esta configurada en .env",
            "type": "variable",
            "variable": {
                "id": variable.id,
                "nombre": variable.nombre,
                "feature": variable.feature.codigo,
            },
        })

    if request.method == "POST":
        try:
            agent = CalibrationAnalystAgent()
            result = agent.analyze(pk)
        except Exception as e:
            result = {"success": False, "error": str(e)}

        if not result.get("success"):
            return render(request, "agents/analyze_result.html", {
                "success": False,
                "error": result.get("error"),
                "type": "variable",
                "variable": {
                    "id": variable.id,
                    "nombre": variable.nombre,
                    "feature": variable.feature.codigo,
                },
            })

        return render(request, "agents/analyze_result.html", {
            "success": True,
            "type": "variable",
            "variable": result["variable"],
            "analysis": result["analysis"],
        })

    return render(request, "agents/analyze_result.html", {
        "success": None,
        "type": "variable",
        "variable": {
            "id": variable.id,
            "nombre": variable.nombre,
            "feature": variable.feature.codigo,
        },
    })


def release_review(request, pk):
    release = get_object_or_404(Release, pk=pk)

    if not settings.ANTHROPIC_API_KEY:
        return render(request, "agents/analyze_result.html", {
            "success": False,
            "error": "ANTHROPIC_API_KEY no esta configurada en .env",
            "type": "release",
            "release": {"id": release.id, "nombre": release.nombre},
        })

    if request.method == "POST":
        try:
            agent = ReleaseReviewAgent()
            result = agent.analyze(pk)
        except Exception as e:
            result = {"success": False, "error": str(e)}

        if not result.get("success"):
            return render(request, "agents/analyze_result.html", {
                "success": False,
                "error": result.get("error"),
                "type": "release",
                "release": {"id": release.id, "nombre": release.nombre},
            })

        return render(request, "agents/analyze_result.html", {
            "success": True,
            "type": "release",
            "release": result["release"],
            "summary": result["summary"],
            "review": result["review"],
        })

    return render(request, "agents/analyze_result.html", {
        "success": None,
        "type": "release",
        "release": {"id": release.id, "nombre": release.nombre},
    })