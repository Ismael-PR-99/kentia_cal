from django.http import JsonResponse
from django.shortcuts import render

from .services import CalibrationAnalystAgent, ReleaseReviewAgent


def variable_analyze(request, pk):
    """
    Analyzes a variable using CalibrationAnalystAgent.
    Returns JSON with analysis results or renders template with analysis.
    """
    agent = CalibrationAnalystAgent()
    result = agent.analyze(pk)

    if not result.get("success"):
        return render(
            request,
            "agents/analyze_result.html",
            {
                "success": False,
                "error": result.get("error"),
                "type": "variable",
            },
        )

    return render(
        request,
        "agents/analyze_result.html",
        {
            "success": True,
            "type": "variable",
            "variable": result["variable"],
            "analysis": result["analysis"],
        },
    )


def release_review(request, pk):
    """
    Reviews a release using ReleaseReviewAgent.
    Returns JSON with review results or renders template with review.
    """
    agent = ReleaseReviewAgent()
    result = agent.analyze(pk)

    if not result.get("success"):
        return render(
            request,
            "agents/analyze_result.html",
            {
                "success": False,
                "error": result.get("error"),
                "type": "release",
            },
        )

    return render(
        request,
        "agents/analyze_result.html",
        {
            "success": True,
            "type": "release",
            "release": result["release"],
            "summary": result["summary"],
            "review": result["review"],
        },
    )
