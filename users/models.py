from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone

from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        OEM = "oem", "OEM"
        SUPPLIER = "supplier", "Supplier"
        VIEWER = "viewer", "Viewer"

    email = models.EmailField(unique=True, verbose_name="Email")
    first_name = models.CharField(max_length=150, blank=True, verbose_name="Nombre")
    last_name = models.CharField(max_length=150, blank=True, verbose_name="Apellidos")
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.VIEWER,
        verbose_name="Rol",
    )
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    is_staff = models.BooleanField(default=False, verbose_name="Staff")
    date_joined = models.DateTimeField(default=timezone.now, verbose_name="Alta")

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ["email"]

    def __str__(self):
        return self.email

    # --- helpers de rol ---
    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_oem(self):
        return self.role == self.Role.OEM

    @property
    def is_supplier(self):
        return self.role == self.Role.SUPPLIER

    @property
    def is_viewer(self):
        return self.role == self.Role.VIEWER
