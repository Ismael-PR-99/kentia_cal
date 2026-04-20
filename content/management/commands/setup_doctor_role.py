from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from content.models import Article


class Command(BaseCommand):
    help = 'Crea el grupo Doctor con permisos para gestionar artículos'

    def handle(self, *args, **options):
        # Crear o obtener el grupo Doctor
        doctor_group, created = Group.objects.get_or_create(name='Doctor')
        
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Grupo "Doctor" creado'))
        else:
            self.stdout.write(self.style.WARNING('→ Grupo "Doctor" ya existe'))

        # Obtener el ContentType de Article
        content_type = ContentType.objects.get_for_model(Article)

        # Permisos necesarios para gestionar artículos
        permission_codenames = [
            'add_article',
            'change_article',
            'view_article',
            'delete_article',  # Añado delete por si acaso
        ]

        # Asignar permisos al grupo
        permissions_added = 0
        for codename in permission_codenames:
            try:
                permission = Permission.objects.get(
                    codename=codename,
                    content_type=content_type
                )
                doctor_group.permissions.add(permission)
                permissions_added += 1
            except Permission.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'✗ Permiso {codename} no encontrado')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'✓ {permissions_added} permisos asignados al grupo Doctor'
            )
        )
        
        self.stdout.write(
            self.style.SUCCESS('\n✅ Configuración completada. Ahora puedes asignar usuarios al grupo "Doctor" desde el admin.')
        )
