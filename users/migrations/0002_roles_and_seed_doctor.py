from django.db import migrations, models
from django.contrib.auth.hashers import make_password


def seed_and_migrate_roles(apps, schema_editor):
    User = apps.get_model("users", "User")

    User.objects.filter(role__in=["ADMIN", "MANAGER"]).update(role="doctor")
    User.objects.filter(role="EMPLOYEE").update(role="paciente")

    email = "doctor@gmail.com"
    if not User.objects.filter(email=email).exists():
        user = User(
            email=email,
            role="doctor",
            is_active=True,
            is_staff=True,
        )
        user.password = make_password("pi48ELFC*")
        user.save()


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[("doctor", "Doctor"), ("paciente", "Paciente")],
                default="paciente",
                max_length=20,
            ),
        ),
        migrations.RunPython(seed_and_migrate_roles, noop_reverse),
    ]
