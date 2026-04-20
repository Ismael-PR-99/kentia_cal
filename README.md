# FisioApp - Plataforma de Salud y Bienestar

> Sistema completo de gestión de salud personal con contenido educativo público y herramientas de seguimiento privadas.

## 🚀 Stack Tecnológico

### Backend
- Django 5.2.10
- Django REST Framework 3.16.1
- PostgreSQL (producción) / SQLite (desarrollo)
- JWT Authentication (SimpleJWT)

### Frontend
- React 18
- Vite 5.4
- TailwindCSS 3.4
- React Router 6
- Framer Motion 12

## 📦 Funcionalidades

### 🌐 Públicas (sin autenticación)
- ✅ **Blog educativo** sobre salud y bienestar
- ✅ **Calculadoras de salud**: IMC, calorías diarias, hidratación
- ✅ **Biblioteca de recursos** descargables
- ✅ **Búsqueda y filtros** de contenido
- ✅ **Registro de usuarios**

### 🔐 Privadas (requieren autenticación)
- ✅ **Gestión de usuarios** con roles (doctor/paciente)
- ✅ **Gestión de pacientes** (solo doctores)
- 🔜 Dashboard personal con métricas
- 🔜 Seguimiento de hábitos diarios
- 🔜 Objetivos y progreso

## 🔧 Instalación y Configuración

### Requisitos Previos
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ (opcional, usa SQLite por defecto)

### 1. Clonar el repositorio
```bash
git clone https://github.com/Ismael-PR-99/FisioApp.git
cd FisioApp
```

### 2. Configurar Backend (Django)

```bash
# Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Copiar .env.example a .env y ajustar valores

# Aplicar migraciones
python manage.py migrate

# Crear datos de ejemplo (opcional)
python manage.py seed_content

# Crear superusuario (opcional para admin)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
```

Backend disponible en: http://127.0.0.1:8000/

### 3. Configurar Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Frontend disponible en: http://localhost:5173/

## 🌍 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Django
DJANGO_SECRET_KEY=tu-clave-secreta
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Base de datos (opcional, usa SQLite si no se configura)
USE_POSTGRES=false
POSTGRES_DB=fisioapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=tu-password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_SCHEMA=fisioterapia

# CORS
CORS_ALLOW_ALL_ORIGINS=false
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 📡 API Endpoints

Ver documentación completa en [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

### Públicos
- `GET /api/articles/` - Listar artículos
- `GET /api/articles/{slug}/` - Detalle de artículo
- `GET /api/categories/` - Listar categorías
- `GET /api/resources/` - Recursos descargables
- `POST /api/calculators/bmi/` - Calculadora IMC
- `POST /api/calculators/calories/` - Calculadora calorías
- `POST /api/calculators/water/` - Calculadora hidratación
- `POST /api/auth/register/` - Registro de usuario

### Privados (requieren JWT)
- `POST /api/auth/token/` - Login
- `GET /api/users/` - Gestión de usuarios
- `GET /api/patients/` - Gestión de pacientes

## 🔑 Credenciales de Prueba

```
Email: doctor@gmail.com
Contraseña: pi48ELFC*
Rol: doctor
```

## 🎨 Admin Panel

Accede al panel de administración:
- URL: http://127.0.0.1:8000/admin/
- Usuario: doctor@gmail.com
- Contraseña: pi48ELFC*

## 🗂️ Estructura del Proyecto

```
FisioApp/
├── backend/              # Configuración Django
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── users/                # App de usuarios y autenticación
│   ├── models.py         # Modelo User personalizado
│   ├── views.py          # ViewSet de usuarios
│   └── permissions.py    # Permisos personalizados
├── patients/             # App de gestión de pacientes
│   ├── models.py
│   └── views.py
├── content/              # App de blog y contenido público
│   ├── models.py         # Article, Category, Tag, Resource
│   ├── views.py          # ViewSets públicos
│   └── serializers.py
├── calculators/          # App de calculadoras de salud
│   ├── views.py          # APIViews públicas
│   └── urls.py
├── frontend/             # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
│   └── package.json
├── requirements.txt
└── manage.py
```

## 🧪 Testing

### Backend
```bash
python manage.py test
```

### Testear endpoints con curl
```bash
# Listar artículos
curl http://127.0.0.1:8000/api/articles/

# Calcular IMC
curl -X POST http://127.0.0.1:8000/api/calculators/bmi/ \
  -H "Content-Type: application/json" \
  -d '{"weight": 70, "height": 1.75}'
```

## 📝 Próximas Funcionalidades

### Fase 2 - Dashboard Personal
- [ ] Panel de control personalizado
- [ ] Seguimiento de hábitos (agua, ejercicio, sueño)
- [ ] Establecimiento de objetivos
- [ ] Gráficos de progreso
- [ ] Recordatorios

### Fase 3 - Comunidad
- [ ] Sistema de comentarios
- [ ] Favoritos y listas de lectura
- [ ] Newsletter
- [ ] Compartir progreso

## ⚖️ Disclaimer Legal

**Importante:** Esta plataforma proporciona información general con fines educativos únicamente. El contenido no constituye asesoramiento médico, diagnóstico o tratamiento. Siempre consulte con un profesional de la salud calificado antes de tomar decisiones sobre su salud.

## 📄 Licencia

Este proyecto es privado y de uso educativo.

## 👨‍💻 Autor

Desarrollado por Ismael PR

## 📞 Contacto

GitHub: [@Ismael-PR-99](https://github.com/Ismael-PR-99)

---

**¿Necesitas ayuda?** Revisa la [documentación completa de la API](API_DOCUMENTATION.md) o abre un issue en GitHub.

