from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F

from .models import Article, Category, Tag, Resource
from .serializers import (
    ArticleListSerializer, ArticleDetailSerializer,
    CategorySerializer, TagSerializer, ResourceSerializer
)


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista pública de artículos del blog.
    Solo lectura, sin autenticación requerida.
    """
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "excerpt", "content"]
    ordering_fields = ["published_at", "views_count", "created_at"]
    ordering = ["-published_at"]
    lookup_field = "slug"

    def get_queryset(self):
        # Solo mostrar artículos publicados (status='published')
        queryset = Article.objects.filter(status='published').select_related(
            "author", "category", "reviewed_by"
        ).prefetch_related("tags")
        
        # Filtro por categoría
        category = self.request.query_params.get("category", None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filtro por tag
        tag = self.request.query_params.get("tag", None)
        if tag:
            queryset = queryset.filter(tags__slug=tag)
        
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ArticleDetailSerializer
        return ArticleListSerializer

    def retrieve(self, request, *args, **kwargs):
        """Incrementar contador de vistas al ver detalle"""
        instance = self.get_object()
        Article.objects.filter(pk=instance.pk).update(views_count=F("views_count") + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista pública de categorías.
    """
    permission_classes = [AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista pública de tags/etiquetas.
    """
    permission_classes = [AllowAny]
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = "slug"


class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Vista pública de recursos descargables.
    """
    permission_classes = [AllowAny]
    serializer_class = ResourceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "downloads_count"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = Resource.objects.filter(is_public=True).select_related(
            "category"
        ).prefetch_related("tags")
        
        # Filtro por tipo de recurso
        resource_type = self.request.query_params.get("type", None)
        if resource_type:
            queryset = queryset.filter(resource_type=resource_type)
        
        # Filtro por categoría
        category = self.request.query_params.get("category", None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        return queryset

    def retrieve(self, request, *args, **kwargs):
        """Incrementar contador de descargas"""
        instance = self.get_object()
        Resource.objects.filter(pk=instance.pk).update(downloads_count=F("downloads_count") + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
