"""
Test script to validate agent services structure.
This file is optional and can be deleted after verification.
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "kentia_cal.settings")
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
django.setup()

from agents.services import CalibrationAnalystAgent, ReleaseReviewAgent
from calibrations.models import Variable, Release

print("=" * 60)
print("Agent Services Validation Test")
print("=" * 60)

# Test 1: Instantiate agents without API key (should fail gracefully)
print("\n[Test 1] Instantiate agents without API key...")
try:
    # Temporarily set empty API key to test error handling
    from django.conf import settings
    original_key = settings.ANTHROPIC_API_KEY
    settings.ANTHROPIC_API_KEY = ""
    
    try:
        agent = CalibrationAnalystAgent()
        print("  ERROR: Should have raised ValueError for missing API key")
    except ValueError as e:
        print(f"  OK: Correctly raised ValueError: {e}")
    
    settings.ANTHROPIC_API_KEY = original_key
except Exception as e:
    print(f"  ERROR: {e}")

# Test 2: Verify database models exist
print("\n[Test 2] Check database models...")
try:
    var_count = Variable.objects.count()
    release_count = Release.objects.count()
    print(f"  OK: Found {var_count} variables and {release_count} releases in database")
except Exception as e:
    print(f"  ERROR: {e}")

# Test 3: Check services module structure
print("\n[Test 3] Check service methods exist...")
try:
    methods_ok = True
    if not hasattr(CalibrationAnalystAgent, "analyze"):
        print("  ERROR: CalibrationAnalystAgent missing analyze method")
        methods_ok = False
    if not hasattr(ReleaseReviewAgent, "analyze"):
        print("  ERROR: ReleaseReviewAgent missing analyze method")
        methods_ok = False
    if methods_ok:
        print("  OK: All required methods exist")
except Exception as e:
    print(f"  ERROR: {e}")

print("\n" + "=" * 60)
print("Validation complete!")
print("=" * 60)
