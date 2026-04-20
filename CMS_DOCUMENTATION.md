# 📝 Sistema de Gestión de Artículos (CMS)

## 🎯 Resumen

Sistema profesional de gestión de contenido editorial usando Django Admin como CMS. Los doctores crean y publican artículos con imágenes, los usuarios públicos los leen.

## 🏗️ Arquitectura

### Roles

**Doctor (Group)**
- Permisos: `add_article`, `change_article`, `view_article`, `delete_article`
- Acceso: Django Admin (`/admin`)
- No es un modelo nuevo, es un usuario con permisos específicos

**Usuario Normal**
- Solo lectura de artículos públicos
- Sin acceso al admin
- Sin permisos sobre artículos

**Superuser**
- Acceso total al admin
- Puede gestionar todo el sistema

### Modelo Article

```python
class Article(models.Model):
    # Contenido
    title = CharField(max_length=200)
    slug = SlugField(unique=True, auto-generado)
    content = TextField()
    excerpt = TextField(max_length=500)
    
    # Imagen (archivo local)
    featured_image = ImageField(upload_to='articles/%Y/%m/')
    
    # Relaciones
    author = ForeignKey(User)
    category = ForeignKey(Category)
    tags = ManyToManyField(Tag)
    
    # Estado
    status = 'draft' | 'published'  # Reemplaza is_published
    is_verified = Boolean
    reviewed_by = ForeignKey(User)
    
    # Metadata
    source_url = URLField()
    views_count = PositiveIntegerField
    published_at = DateTimeField
    created_at = DateTimeField
    updated_at = DateTimeField
```

## 🔒 Seguridad y Permisos

### Acceso al Django Admin

**ArticleAdmin** implementa:

```python
def has_module_permission(self, request):
    """Solo superusuarios y grupo Doctor ven el módulo"""
    if request.user.is_superuser:
        return True
    return request.user.groups.filter(name='Doctor').exists()

def has_add_permission(self, request):
    """Solo superusuarios y grupo Doctor crean artículos"""
    # Similar al anterior

def has_change_permission(self, request, obj=None):
    """Solo superusuarios y grupo Doctor editan artículos"""
    # Similar al anterior

def has_delete_permission(self, request, obj=None):
    """Solo superusuarios eliminan artículos"""
    return request.user.is_superuser
```

### API Pública

**Endpoint**: `GET /api/articles/`

```python
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]  # Sin autenticación
    
    def get_queryset(self):
        # ⚠️ SOLO artículos con status='published'
        return Article.objects.filter(status='published')
```

## 📸 Gestión de Imágenes

### Configuración

**settings.py**:
```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

**urls.py** (desarrollo):
```python
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Subida de Imágenes

- **Dónde**: Django Admin únicamente
- **Campo**: `featured_image` (ImageField)
- **Ruta**: `media/articles/YYYY/MM/filename.jpg`
- **Dependencia**: Pillow (`pip install Pillow`)

### Visualización en Admin

```python
def image_preview(self, obj):
    """Muestra miniatura 50x50px en listado"""
    if obj.featured_image:
        return format_html(
            '<img src="{}" width="50" height="50" style="object-fit: cover;" />',
            obj.featured_image.url
        )
    return "Sin imagen"
```

## 🚀 Flujo de Trabajo

### 1. Crear Usuario Doctor

**Opción A: Asignar usuario existente**
```python
python manage.py shell

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()
doctor = User.objects.get(email='doctor@gmail.com')
group = Group.objects.get(name='Doctor')

doctor.groups.add(group)
doctor.is_staff = True  # Requerido para acceso al admin
doctor.save()
```

**Opción B: Crear nuevo doctor desde admin**
1. Login como superuser en `/admin`
2. Ir a Users → Add user
3. Completar datos y guardar
4. En la edición:
   - Marcar `Staff status` ✓
   - Añadir al grupo `Doctor`
5. Guardar

### 2. Doctor Crea Artículo

1. Login en `/admin` (doctor@gmail.com / pi48ELFC*)
2. Ir a **Content → Articles → Add Article**
3. Completar campos:
   - **Title**: Auto-genera slug
   - **Excerpt**: Resumen breve
   - **Content**: Contenido completo
   - **Featured Image**: Subir imagen (opcional)
   - **Category**: Seleccionar o crear
   - **Tags**: Seleccionar múltiples
   - **Author**: Auto-asignado
   - **Status**: `draft` (borrador) o `published` (publicado)
4. Click **Save**

### 3. Publicar Artículo

**Cambiar status**:
- `draft` → Visible solo en admin
- `published` → Visible en API pública + frontend

**Auto-asignación de fecha**:
```python
if self.status == 'published' and not self.published_at:
    self.published_at = timezone.now()
```

### 4. Usuario Lee Artículo

**Frontend** (Home.jsx):
```javascript
// GET /api/articles/ (solo published)
const { data } = await axios.get('http://localhost:8000/api/articles/');

articles.map(article => (
  <div>
    <h3>{article.title}</h3>
    <p>{article.excerpt}</p>
    {article.featured_image && (
      <img src={article.featured_image} alt={article.title} />
    )}
  </div>
))
```

## 🛠️ Comandos de Management

### setup_doctor_role

Crea el grupo Doctor con permisos.

```bash
python manage.py setup_doctor_role
```

**Resultado**:
- Crea grupo `Doctor`
- Asigna permisos: `add_article`, `change_article`, `view_article`, `delete_article`
- Idempotente (puedes ejecutarlo múltiples veces)

### seed_content

Crea datos de ejemplo (categorías, tags, artículos).

```bash
python manage.py seed_content
```

**Requisito**: Usuario con `role='doctor'` debe existir.

**Crea**:
- 5 categorías (Nutrición, Ejercicio, Sueño, Salud Mental, Prevención)
- 10 tags
- 3 artículos de ejemplo con `status='published'`

## 📦 Estructura de Archivos

```
content/
├── models.py               # Article, Category, Tag, Resource
├── serializers.py          # Serializers con featured_image
├── views.py                # ViewSets públicos (AllowAny)
├── admin.py                # ArticleAdmin con permisos
├── urls.py                 # Routes: /api/articles/, /api/categories/
├── management/
│   └── commands/
│       ├── setup_doctor_role.py    # Crear grupo Doctor
│       └── seed_content.py         # Datos de ejemplo
└── migrations/
    ├── 0001_initial.py
    └── 0002_alter_article_options... # Migrations (status, featured_image)

media/
└── articles/
    └── 2026/
        └── 02/
            └── imagen-articulo.jpg

backend/
├── settings.py             # MEDIA_ROOT, MEDIA_URL
└── urls.py                 # static(MEDIA_URL) en DEBUG
```

## 🔍 Django Admin Features

### ArticleAdmin Config

**list_display**:
```python
["title", "author", "category", "status", "is_verified", 
 "published_at", "views_count", "image_preview"]
```

**list_filter**:
```python
["status", "is_verified", "category", "created_at", "published_at"]
```

**search_fields**:
```python
["title", "content", "excerpt"]
```

**prepopulated_fields**:
```python
{"slug": ("title",)}  # Auto-genera slug desde título
```

**filter_horizontal**:
```python
["tags"]  # Widget mejorado para M2M
```

**date_hierarchy**:
```python
"published_at"  # Navegación por fechas
```

## 🌐 API Endpoints

### Artículos

**List**
```http
GET /api/articles/
```
Filtros:
- `?category=nutricion` - Por categoría (slug)
- `?tag=principiantes` - Por tag (slug)
- `?search=ejercicio` - Búsqueda en título/excerpt/content
- `?ordering=-views_count` - Ordenar por vistas

**Detail**
```http
GET /api/articles/{slug}/
```
- Incrementa `views_count` automáticamente
- Serializer detallado (content completo)

### Categorías

```http
GET /api/categories/
GET /api/categories/{slug}/
```

### Tags

```http
GET /api/tags/
GET /api/tags/{slug}/
```

## ⚡ Migraciones Aplicadas

```bash
# Generar migraciones
python manage.py makemigrations

# Resultado:
# - Remove field is_published
# - Remove field image_url
# - Add field status (default='draft')
# - Add field featured_image (ImageField)
# - Alter field verbose_name en todos los campos

# Aplicar migraciones
python manage.py migrate
```

## 📊 Serializer Response

**ArticleListSerializer**:
```json
{
  "id": 1,
  "title": "10 Hábitos para una Vida Saludable",
  "slug": "10-habitos-para-una-vida-saludable",
  "excerpt": "Descubre los hábitos fundamentales...",
  "category": {
    "id": 5,
    "name": "Prevención",
    "slug": "prevencion",
    "description": "Hábitos preventivos y autocuidado",
    "articles_count": 3
  },
  "tags": [
    {"id": 1, "name": "principiantes", "slug": "principiantes"},
    {"id": 10, "name": "hábitos", "slug": "habitos"}
  ],
  "author_name": "doctor@gmail.com",
  "featured_image": "http://localhost:8000/media/articles/2026/02/salud.jpg",
  "is_verified": true,
  "views_count": 42,
  "published_at": "2026-02-05T10:30:00Z",
  "created_at": "2026-02-04T15:20:00Z"
}
```

## 🎨 Frontend Integration

**Mostrar imagen destacada**:
```jsx
{article.featured_image && (
  <img 
    src={article.featured_image} 
    alt={article.title}
    className="w-full h-48 object-cover rounded-t-xl"
  />
)}
```

**Badge de verificación**:
```jsx
{article.is_verified && (
  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
    ✓ Verificado
  </span>
)}
```

## ✅ Checklist de Implementación

- [x] Crear Group "Doctor" con permisos (comando `setup_doctor_role`)
- [x] Ajustar modelo Article (status, featured_image)
- [x] Configurar MEDIA_ROOT y MEDIA_URL
- [x] Configurar ArticleAdmin con restricciones
- [x] Filtrar API pública por status='published'
- [x] Actualizar serializers (featured_image en lugar de image_url)
- [x] Aplicar migraciones
- [x] Instalar Pillow para ImageField
- [x] Asignar doctor@gmail.com al grupo Doctor
- [x] Actualizar artículos existentes a status='published'
- [x] Actualizar comando seed_content

## 🔐 Credenciales

**Superuser** (acceso completo):
- Email: (no especificado)
- Password: (no especificado)

**Doctor** (gestión de artículos):
- Email: `doctor@gmail.com`
- Password: `pi48ELFC*`
- Acceso: `/admin`
- Grupo: `Doctor`
- `is_staff`: `True`

## 📝 Notas Importantes

### ✅ Ventajas de Usar Django Admin

- **Profesional**: Sistema maduro y probado
- **Seguro**: Permisos nativos de Django
- **Rápido**: Sin necesidad de frontend custom
- **Mantenible**: Estándar de la industria
- **Escalable**: Fácil añadir más modelos

### ⚠️ Importantes

1. **Sin rich editor por ahora**: Content es TextField plano. Considera añadir CKEditor/TinyMCE si necesitas formato HTML.

2. **Imágenes en producción**: Configurar almacenamiento externo (S3, Cloudinary) para producción.

3. **Permisos granulares**: Actualmente Doctor puede editar TODOS los artículos. Considera limitar a "solo mis artículos" si es necesario.

4. **Borrado**: Solo superuser puede eliminar artículos (protección extra).

## 🚀 Próximos Pasos (Opcional)

- [ ] Rich text editor (CKEditor/TinyMCE)
- [ ] Permisos "solo editar mis artículos"
- [ ] Sistema de revisión (workflow draft → review → published)
- [ ] Almacenamiento S3 para imágenes en producción
- [ ] Versionado de artículos
- [ ] Programación de publicaciones (scheduled posts)
- [ ] Analytics (Google Analytics, Matomo)

---

**Implementado**: 5 de febrero de 2026  
**Stack**: Django 5.2.10 + DRF 3.16.1 + PostgreSQL + React 18
