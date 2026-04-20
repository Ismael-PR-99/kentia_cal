from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "doctor")


class UserManagementPermission(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == "doctor":
            return True
        return obj.id == request.user.id and request.method in SAFE_METHODS

    def has_permission(self, request, view):
        if request.user.role == "doctor":
            return True
        return request.method in SAFE_METHODS
