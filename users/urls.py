from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")

urlpatterns = router.urls

urlpatterns += [
	path("auth/register/", RegisterView.as_view(), name="auth_register"),
]
