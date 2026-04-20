from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Article(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Borrador'),
        ('published', 'Publicado'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Título")
    slug = models.SlugField(max_length=250, unique=True, blank=True, verbose_name="URL amigable")
    content = models.TextField(verbose_name="Contenido")
    excerpt = models.TextField(max_length=500, help_text="Resumen breve del artículo", verbose_name="Extracto")
    
    # Imagen destacada (archivo local)
    featured_image = models.ImageField(
        upload_to='articles/%Y/%m/',
        blank=True,
        null=True,
        verbose_name="Imagen destacada",
        help_text="Imagen principal del artículo"
    )
    
    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="articles",
        verbose_name="Autor"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="articles",
        verbose_name="Categoría"
    )
    tags = models.ManyToManyField(Tag, related_name="articles", blank=True, verbose_name="Etiquetas")
    
    # Estado del artículo (reemplaza is_published)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name="Estado"
    )
    
    is_verified = models.BooleanField(
        default=False,
        help_text="Verificado por profesional",
        verbose_name="Verificado"
    )
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_articles",
        verbose_name="Revisado por"
    )
    
    source_url = models.URLField(blank=True, null=True, help_text="Fuente de referencia", verbose_name="Fuente")
    
    views_count = models.PositiveIntegerField(default=0, verbose_name="Vistas")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Creado")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Actualizado")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Fecha de publicación")

    class Meta:
        ordering = ["-published_at", "-created_at"]
        verbose_name = "Artículo"
        verbose_name_plural = "Artículos"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        # Si se publica y no tiene fecha de publicación, asignarla
        if self.status == 'published' and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Resource(models.Model):
    RESOURCE_TYPES = [
        ("pdf", "PDF"),
        ("video", "Video"),
        ("infographic", "Infografía"),
        ("guide", "Guía"),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    file_url = models.URLField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="resources")
    tags = models.ManyToManyField(Tag, related_name="resources", blank=True)
    
    is_public = models.BooleanField(default=True)
    downloads_count = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
