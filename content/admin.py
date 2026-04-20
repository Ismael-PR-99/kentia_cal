from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.models import Group
from .models import Article, Category, Tag, Resource


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name", "description"]


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ["name"]


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "author",
        "category",
        "status",
        "is_verified",
        "published_at",
        "views_count",
        "image_preview"
    ]
    list_filter = ["status", "is_verified", "category", "created_at", "published_at"]
    search_fields = ["title", "content", "excerpt"]
    prepopulated_fields = {"slug": ("title",)}
    filter_horizontal = ["tags"]
    date_hierarchy = "published_at"
    
    fieldsets = (
        ("Contenido", {
            "fields": ("title", "slug", "excerpt", "content")
        }),
        ("Imagen", {
            "fields": ("featured_image",),
            "description": "Sube la imagen destacada del artículo"
        }),
        ("Clasificación", {
            "fields": ("category", "tags")
        }),
        ("Autoría y Verificación", {
            "fields": ("author", "is_verified", "reviewed_by", "source_url")
        }),
        ("Publicación", {
            "fields": ("status", "published_at")
        }),
        ("Estadísticas", {
            "fields": ("views_count",),
            "classes": ("collapse",)
        }),
    )
    
    def image_preview(self, obj):
        """Muestra una miniatura de la imagen destacada en el listado"""
        if obj.featured_image:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />',
                obj.featured_image.url
            )
        return "Sin imagen"
    image_preview.short_description = "Vista previa"
    
    def has_module_permission(self, request):
        """Solo superusuarios y usuarios del grupo Doctor pueden ver el módulo"""
        if request.user.is_superuser:
            return True
        return request.user.groups.filter(name='Doctor').exists()
    
    def has_view_permission(self, request, obj=None):
        """Solo superusuarios y grupo Doctor pueden ver artículos"""
        if request.user.is_superuser:
            return True
        return request.user.groups.filter(name='Doctor').exists()
    
    def has_add_permission(self, request):
        """Solo superusuarios y grupo Doctor pueden crear artículos"""
        if request.user.is_superuser:
            return True
        return request.user.groups.filter(name='Doctor').exists()
    
    def has_change_permission(self, request, obj=None):
        """Solo superusuarios y grupo Doctor pueden editar artículos"""
        if request.user.is_superuser:
            return True
        return request.user.groups.filter(name='Doctor').exists()
    
    def has_delete_permission(self, request, obj=None):
        """Solo superusuarios pueden eliminar artículos"""
        return request.user.is_superuser


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ["title", "resource_type", "category", "is_public", "downloads_count", "created_at"]
    list_filter = ["resource_type", "is_public", "category"]
    search_fields = ["title", "description"]
    filter_horizontal = ["tags"]
