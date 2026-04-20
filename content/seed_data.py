"""
Script para crear datos iniciales del blog de salud.
Ejecutar con: python manage.py shell < content/seed_data.py
"""

from django.contrib.auth import get_user_model
from content.models import Category, Tag, Article, Resource
from datetime import datetime, timezone

User = get_user_model()

# Obtener usuario doctor
doctor = User.objects.filter(role="doctor").first()

if not doctor:
    print("❌ No se encontró usuario doctor. Ejecuta las migraciones primero.")
    exit()

# Crear categorías
categories_data = [
    {"name": "Nutrición", "description": "Guías sobre alimentación saludable y nutrientes esenciales"},
    {"name": "Ejercicio", "description": "Rutinas de ejercicio y actividad física"},
    {"name": "Sueño", "description": "Consejos para mejorar la calidad del sueño"},
    {"name": "Salud Mental", "description": "Bienestar emocional y manejo del estrés"},
    {"name": "Prevención", "description": "Hábitos preventivos y autocuidado"},
]

print("📂 Creando categorías...")
for cat_data in categories_data:
    cat, created = Category.objects.get_or_create(
        name=cat_data["name"],
        defaults={"description": cat_data["description"]}
    )
    print(f"  {'✓ Creada' if created else '○ Ya existe'}: {cat.name}")

# Crear tags
tags_data = ["principiantes", "avanzado", "dieta", "hidratación", "meditación", 
             "cardio", "fuerza", "flexibilidad", "descanso", "hábitos"]

print("\n🏷️  Creando tags...")
for tag_name in tags_data:
    tag, created = Tag.objects.get_or_create(name=tag_name)
    print(f"  {'✓' if created else '○'} {tag.name}")

# Crear artículos de ejemplo
print("\n📝 Creando artículos...")

articles_data = [
    {
        "title": "10 Hábitos para una Vida Saludable",
        "excerpt": "Descubre los hábitos fundamentales que transformarán tu bienestar físico y mental de forma sostenible.",
        "content": """
## Introducción

La salud no es solo la ausencia de enfermedad, sino un estado completo de bienestar físico, mental y social. Estos 10 hábitos te ayudarán a mejorar tu calidad de vida.

### 1. Hidratación Adecuada
Bebe al menos 2 litros de agua al día. La hidratación es fundamental para todas las funciones corporales.

### 2. Alimentación Balanceada
Include frutas, verduras, proteínas magras y granos integrales en tu dieta diaria.

### 3. Ejercicio Regular
30 minutos de actividad física moderada, 5 días a la semana.

### 4. Sueño de Calidad
7-9 horas de sueño reparador cada noche.

### 5. Manejo del Estrés
Practica técnicas de relajación como meditación o yoga.

**Recuerda:** Estos son hábitos generales. Consulta con un profesional para recomendaciones personalizadas.
        """,
        "category": "Prevención",
        "tags": ["principiantes", "hábitos"],
        "is_published": True,
        "is_verified": True,
    },
    {
        "title": "Guía Completa de Hidratación Saludable",
        "excerpt": "Aprende cuánta agua necesitas realmente y cómo mantener una hidratación óptima durante todo el día.",
        "content": """
## ¿Por qué es importante la hidratación?

El agua constituye aproximadamente el 60% de nuestro cuerpo y es esencial para:
- Regulación de temperatura corporal
- Transporte de nutrientes
- Eliminación de toxinas
- Lubricación de articulaciones

### ¿Cuánta agua necesitas?

La recomendación general es 30-35 ml por kg de peso corporal. Para una persona de 70 kg, serían aproximadamente 2-2.5 litros al día.

### Factores que aumentan tus necesidades:
- Ejercicio físico
- Clima caluroso
- Embarazo o lactancia
- Enfermedades con fiebre

### Señales de deshidratación:
- Sed
- Orina oscura
- Fatiga
- Mareos
- Piel seca

**Consejo:** No esperes a tener sed. Bebe agua regularmente durante el día.
        """,
        "category": "Nutrición",
        "tags": ["hidratación", "principiantes", "hábitos"],
        "is_published": True,
        "is_verified": True,
    },
    {
        "title": "Entrenamiento de Fuerza para Principiantes",
        "excerpt": "Comienza tu viaje en el entrenamiento de fuerza con esta guía completa y segura.",
        "content": """
## Beneficios del Entrenamiento de Fuerza

- Aumenta la masa muscular
- Mejora la densidad ósea
- Acelera el metabolismo
- Previene lesiones
- Mejora la postura

### Principios Básicos

1. **Calentamiento**: 5-10 minutos de cardio ligero
2. **Técnica antes que peso**: Domina el movimiento correcto
3. **Progresión gradual**: Aumenta peso o repeticiones lentamente
4. **Descanso**: Permite 48h de recuperación entre sesiones

### Rutina Básica (3 días/semana)

**Día A:**
- Sentadillas: 3x10
- Press de pecho: 3x10
- Remo con mancuernas: 3x10

**Día B:**
- Peso muerto: 3x8
- Press de hombros: 3x10
- Curl de bíceps: 3x12

**Importante:** Consulta con un entrenador profesional antes de comenzar.
        """,
        "category": "Ejercicio",
        "tags": ["principiantes", "fuerza"],
        "is_published": True,
        "is_verified": True,
    },
    {
        "title": "Mejora tu Calidad de Sueño: Guía Práctica",
        "excerpt": "Estrategias científicamente probadas para dormir mejor y despertar renovado.",
        "content": """
## La Importancia del Sueño

El sueño de calidad es fundamental para:
- Consolidación de la memoria
- Reparación celular
- Regulación hormonal
- Sistema inmunológico
- Salud mental

### Higiene del Sueño

**Antes de dormir:**
- Establece un horario regular
- Evita pantallas 1 hora antes
- Mantén tu habitación fresca (18-20°C)
- Usa tu cama solo para dormir
- Evita cafeína después de las 14:00

**Ambiente ideal:**
- Oscuridad total
- Silencio (o ruido blanco)
- Temperatura fresca
- Colchón cómodo

### Si no puedes dormir:

1. Levántate después de 20 minutos
2. Haz una actividad relajante
3. Vuelve a la cama cuando tengas sueño
4. No mires el reloj

**Consulta médica si:** Tienes insomnio persistente por más de 3 semanas.
        """,
        "category": "Sueño",
        "tags": ["descanso", "hábitos"],
        "is_published": True,
        "is_verified": True,
    },
    {
        "title": "Introducción a la Meditación Mindfulness",
        "excerpt": "Aprende técnicas básicas de meditación para reducir el estrés y mejorar tu bienestar mental.",
        "content": """
## ¿Qué es Mindfulness?

Mindfulness es la práctica de prestar atención al momento presente de forma intencional y sin juzgar.

### Beneficios Comprobados:

- Reduce el estrés y la ansiedad
- Mejora la concentración
- Aumenta el bienestar emocional
- Mejora la calidad del sueño
- Reduce la presión arterial

### Práctica Básica (5 minutos)

1. **Postura**: Siéntate cómodamente con la espalda recta
2. **Respiración**: Cierra los ojos y enfócate en tu respiración
3. **Observación**: Nota cómo entra y sale el aire
4. **Distracción**: Cuando tu mente divague, vuelve gentilmente a la respiración
5. **Cierre**: Abre los ojos lentamente

### Consejos para Principiantes:

- Empieza con 5 minutos al día
- Practica a la misma hora
- No te juzgues si tu mente divaga
- La consistencia es más importante que la duración

### Apps Recomendadas:

- Insight Timer
- Headspace
- Calm

**Inicia hoy:** Incluso 5 minutos diarios pueden marcar la diferencia.
        """,
        "category": "Salud Mental",
        "tags": ["meditación", "principiantes", "hábitos"],
        "is_published": True,
        "is_verified": True,
    },
]

for art_data in articles_data:
    category = Category.objects.get(name=art_data["category"])
    tags = [Tag.objects.get(name=tag_name) for tag_name in art_data["tags"]]
    
    article, created = Article.objects.get_or_create(
        title=art_data["title"],
        defaults={
            "excerpt": art_data["excerpt"],
            "content": art_data["content"],
            "category": category,
            "author": doctor,
            "reviewed_by": doctor,
            "is_published": art_data["is_published"],
            "is_verified": art_data["is_verified"],
            "published_at": datetime.now(timezone.utc) if art_data["is_published"] else None,
        }
    )
    
    if created:
        article.tags.set(tags)
        print(f"  ✓ {article.title}")
    else:
        print(f"  ○ Ya existe: {article.title}")

print("\n✅ Datos semilla creados exitosamente!")
print(f"📊 Estadísticas:")
print(f"   Categorías: {Category.objects.count()}")
print(f"   Tags: {Tag.objects.count()}")
print(f"   Artículos: {Article.objects.count()}")
print(f"   Artículos publicados: {Article.objects.filter(is_published=True).count()}")
