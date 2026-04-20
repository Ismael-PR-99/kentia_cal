from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from content.models import Category, Tag, Article
from datetime import datetime, timezone

User = get_user_model()


class Command(BaseCommand):
    help = 'Crea datos de ejemplo para el blog de salud'

    def handle(self, *args, **kwargs):
        self.stdout.write("Creando datos de ejemplo...")
        
        doctor = User.objects.filter(role="doctor").first()
        if not doctor:
            self.stdout.write(self.style.ERROR("No se encontro usuario doctor"))
            return

        # Crear categorias
        categories_data = [
            {"name": "Nutricion", "description": "Guias sobre alimentacion saludable"},
            {"name": "Ejercicio", "description": "Rutinas de ejercicio y actividad fisica"},
            {"name": "Sueno", "description": "Consejos para mejorar la calidad del sueno"},
            {"name": "Salud Mental", "description": "Bienestar emocional y manejo del estres"},
            {"name": "Prevencion", "description": "Habitos preventivos y autocuidado"},
        ]

        for cat_data in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_data["name"],
                defaults={"description": cat_data["description"]}
            )
            if created:
                self.stdout.write(f"  Categoria creada: {cat.name}")

        # Crear tags
        tags_data = ["principiantes", "avanzado", "dieta", "hidratacion", "meditacion", 
                     "cardio", "fuerza", "flexibilidad", "descanso", "habitos"]

        for tag_name in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag_name)
            if created:
                self.stdout.write(f"  Tag creado: {tag.name}")

        # Crear articulos
        articles_data = [
            {
                "title": "10 Habitos para una Vida Saludable",
                "excerpt": "Descubre los habitos fundamentales que transformaran tu bienestar fisico y mental.",
                "content": "Introduccion a los habitos saludables esenciales para mejorar tu calidad de vida.",
                "category": "Prevencion",
                "tags": ["principiantes", "habitos"],
            },
            {
                "title": "Guia Completa de Hidratacion Saludable",
                "excerpt": "Aprende cuanta agua necesitas y como mantener una hidratacion optima.",
                "content": "El agua es esencial para tu salud. Aprende como mantenerte hidratado.",
                "category": "Nutricion",
                "tags": ["hidratacion", "principiantes"],
            },
            {
                "title": "Entrenamiento de Fuerza para Principiantes",
                "excerpt": "Comienza tu viaje en el entrenamiento de fuerza con esta guia completa.",
                "content": "Aprende los fundamentos del entrenamiento de fuerza de forma segura.",
                "category": "Ejercicio",
                "tags": ["principiantes", "fuerza"],
            },
        ]

        for art_data in articles_data:
            category = Category.objects.get(name=art_data["category"])
            tags = [Tag.objects.get(name=t) for t in art_data["tags"]]
            
            article, created = Article.objects.get_or_create(
                title=art_data["title"],
                defaults={
                    "excerpt": art_data["excerpt"],
                    "content": art_data["content"],
                    "category": category,
                    "author": doctor,
                    "reviewed_by": doctor,
                    "status": "published",
                    "is_verified": True,
                    "published_at": datetime.now(timezone.utc),
                }
            )
            
            if created:
                article.tags.set(tags)
                self.stdout.write(self.style.SUCCESS(f"  Articulo creado: {article.title}"))

        self.stdout.write(self.style.SUCCESS(f"\nDatos creados exitosamente!"))
        self.stdout.write(f"Categorias: {Category.objects.count()}")
        self.stdout.write(f"Tags: {Tag.objects.count()}")
        self.stdout.write(f"Articulos: {Article.objects.count()}")
