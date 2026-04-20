from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, CategoryViewSet, TagViewSet, ResourceViewSet

router = DefaultRouter()
router.register(r"articles", ArticleViewSet, basename="articles")
router.register(r"categories", CategoryViewSet, basename="categories")
router.register(r"tags", TagViewSet, basename="tags")
router.register(r"resources", ResourceViewSet, basename="resources")

urlpatterns = router.urls
