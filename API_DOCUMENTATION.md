# FisioApp - Fase 1: API Pública Implementada

## 🎯 Nuevas Funcionalidades

### ✅ Blog Público de Salud
- Artículos educativos sobre nutrición, ejercicio, sueño y bienestar
- Categorización y etiquetado de contenido
- Búsqueda y filtros avanzados
- Recursos descargables

### ✅ Calculadoras de Salud
- **IMC (Índice de Masa Corporal)**
- **Calorías Diarias** (Fórmula Harris-Benedict)
- **Hidratación Recomendada**

### ✅ Registro de Usuarios (ya existía)
- Registro opcional para acceso a funcionalidades privadas

---

## 📡 Endpoints API Disponibles

### 🌐 PÚBLICOS (sin autenticación)

#### Blog y Contenido

**Listar artículos**
```http
GET /api/articles/
GET /api/articles/?category=nutricion
GET /api/articles/?tag=principiantes
GET /api/articles/?search=agua
```

**Detalle de artículo**
```http
GET /api/articles/{slug}/
```

**Categorías**
```http
GET /api/categories/
GET /api/categories/{slug}/
```

**Tags**
```http
GET /api/tags/
GET /api/tags/{slug}/
```

**Recursos descargables**
```http
GET /api/resources/
GET /api/resources/?type=pdf
GET /api/resources/?category=nutricion
```

#### Calculadoras

**Calculadora IMC**
```http
POST /api/calculators/bmi/
Content-Type: application/json

{
  "weight": 70,
  "height": 1.75
}
```

**Respuesta:**
```json
{
  "bmi": 22.86,
  "category": "Peso normal",
  "recommendation": "Mantén tus hábitos saludables",
  "disclaimer": "Esta es una herramienta orientativa..."
}
```

**Calculadora de Calorías**
```http
POST /api/calculators/calories/
Content-Type: application/json

{
  "weight": 70,
  "height": 175,
  "age": 30,
  "gender": "male",
  "activity": "moderate"
}
```

**Respuesta:**
```json
{
  "bmr": 1680,
  "daily_calories": 2604,
  "activity_level": "moderate",
  "recommendations": {
    "weight_loss": 2104,
    "maintenance": 2604,
    "weight_gain": 3104
  },
  "disclaimer": "Estas son estimaciones generales..."
}
```

**Niveles de actividad disponibles:**
- `sedentary` - Poco o ningún ejercicio
- `light` - Ejercicio ligero 1-3 días/semana
- `moderate` - Ejercicio moderado 3-5 días/semana
- `active` - Ejercicio intenso 6-7 días/semana
- `very_active` - Ejercicio muy intenso o trabajo físico

**Calculadora de Hidratación**
```http
POST /api/calculators/water/
Content-Type: application/json

{
  "weight": 70,
  "activity": "moderate",
  "climate": "temperate"
}
```

**Respuesta:**
```json
{
  "daily_water_liters": 2.77,
  "daily_water_ml": 2772,
  "glasses_250ml": 11,
  "recommendations": {
    "morning": 3,
    "afternoon": 4,
    "evening": 3
  },
  "tips": [
    "Bebe agua al despertar para rehidratarte",
    "Lleva una botella de agua contigo",
    "Bebe antes de sentir sed"
  ],
  "disclaimer": "Esta es una recomendación general..."
}
```

**Niveles de actividad:** `low`, `moderate`, `high`  
**Tipos de clima:** `cold`, `temperate`, `hot`

#### Registro de Usuarios
```http
POST /api/auth/register/
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña_segura"
}
```

---

### 🔐 PRIVADOS (requieren JWT)

Estos endpoints ya existían:

**Gestión de Usuarios**
```http
GET /api/users/
POST /api/users/
GET /api/users/{id}/
PUT /api/users/{id}/
DELETE /api/users/{id}/
```

**Gestión de Pacientes (solo doctores)**
```http
GET /api/patients/
POST /api/patients/
GET /api/patients/{id}/
PUT /api/patients/{id}/
DELETE /api/patients/{id}/
```

---

## 🗄️ Modelos de Datos Creados

### Category
- `name` - Nombre de la categoría
- `slug` - URL amigable
- `description` - Descripción
- `created_at` - Fecha de creación

### Tag
- `name` - Nombre del tag
- `slug` - URL amigable

### Article
- `title` - Título del artículo
- `slug` - URL amigable
- `content` - Contenido completo (Markdown)
- `excerpt` - Resumen breve
- `author` - Autor del artículo
- `category` - Categoría
- `tags` - Tags asociados
- `is_published` - Publicado/borrador
- `is_verified` - Verificado por profesional
- `reviewed_by` - Quién lo revisó
- `image_url` - URL de imagen destacada
- `source_url` - Fuente de referencia
- `views_count` - Contador de vistas
- `published_at` - Fecha de publicación

### Resource
- `title` - Título del recurso
- `description` - Descripción
- `resource_type` - Tipo: pdf, video, infographic, guide
- `file_url` - URL del archivo
- `category` - Categoría
- `tags` - Tags asociados
- `is_public` - Público/privado
- `downloads_count` - Contador de descargas

---

## 📊 Datos de Ejemplo Creados

- **5 Categorías:** Nutrición, Ejercicio, Sueño, Salud Mental, Prevención
- **10 Tags:** principiantes, avanzado, dieta, hidratación, meditación, cardio, fuerza, flexibilidad, descanso, hábitos
- **3 Artículos publicados y verificados**

### Comando para crear más datos:
```bash
python manage.py seed_content
```

---

## 🎨 Admin Panel

Accede al panel de administración Django para gestionar contenido:

```
http://127.0.0.1:8000/admin/

Usuario: doctor@gmail.com
Contraseña: pi48ELFC*
```

Desde allí puedes:
- Crear/editar artículos
- Gestionar categorías y tags
- Publicar/despublicar contenido
- Marcar artículos como verificados
- Subir recursos

---

## 🚀 Testing de las APIs

### Con curl:

**Listar artículos:**
```bash
curl http://127.0.0.1:8000/api/articles/
```

**Calcular IMC:**
```bash
curl -X POST http://127.0.0.1:8000/api/calculators/bmi/ \
  -H "Content-Type: application/json" \
  -d '{"weight": 70, "height": 1.75}'
```

**Calcular calorías:**
```bash
curl -X POST http://127.0.0.1:8000/api/calculators/calories/ \
  -H "Content-Type: application/json" \
  -d '{"weight":70,"height":175,"age":30,"gender":"male","activity":"moderate"}'
```

**Hidratación:**
```bash
curl -X POST http://127.0.0.1:8000/api/calculators/water/ \
  -H "Content-Type: application/json" \
  -d '{"weight": 70, "activity": "moderate", "climate": "temperate"}'
```

---

## 🔒 Seguridad y Disclaimers

Todos los endpoints públicos incluyen disclaimers legales:

> "Esta es una herramienta orientativa. Consulta con un profesional de la salud."

> "Estas son estimaciones generales. No sustituyen el consejo médico profesional."

---

## 📝 Próximos Pasos (Fase 2)

- [ ] Dashboard personal para usuarios registrados
- [ ] Seguimiento de hábitos diarios
- [ ] Establecimiento de objetivos personales
- [ ] Gráficos de progreso
- [ ] Newsletter
- [ ] Comentarios en artículos
- [ ] Sistema de favoritos

---

## 🛠️ Stack Técnico

- **Backend:** Django 5.2.10 + Django REST Framework
- **Base de Datos:** PostgreSQL (fisioapp / schema fisioterapia)
- **Autenticación:** JWT (SimpleJWT)
- **Frontend:** React 18 + Vite + TailwindCSS
- **Python:** 3.11.9

---

## 📞 Soporte

Para más información sobre la API, visita:
- Documentación interactiva: http://127.0.0.1:8000/api/ (DRF browsable API)
- Admin panel: http://127.0.0.1:8000/admin/
