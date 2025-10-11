# EduPredict (Starter 2025)

## Backend (FastAPI)
```bash
# EduPredict (versión inicial 2025)

Este repositorio contiene la versión inicial del proyecto EduPredict: una pequeña aplicación full-stack con
backend en FastAPI y frontend en React + Vite + Tailwind. El objetivo es proporcionar una interfaz para
predicción del rendimiento académico y un dashboard demo para visualizar resultados.

Contenido del repositorio
- backend/  — FastAPI app (endpoints demo de autenticación y students/predictions)
- frontend/ — React (Vite) + Tailwind UI con splash, login demo y páginas: Home, Prediction, Dashboard, History, About, Contact

Requisitos (local)
- Python 3.10+ (preferible 3.11)
- Node.js 16+ / npm
- Git

## Guía rápida — Backend (FastAPI)
1. Abrir terminal:

```bash
cd backend
# Crear y activar virtualenv (Linux/macOS)
python -m venv .venv && source .venv/bin/activate
# Windows (PowerShell)
. .venv\Scripts\Activate.ps1
# Windows (cmd.exe)
.venv\Scripts\activate

pip install -r requirements.txt
# (opcional) copia el ejemplo de env
cp .env.example .env
# lanzar en modo desarrollo
uvicorn app.main:app --reload --port 8000
```

El backend expondrá por defecto la API en `http://127.0.0.1:8000`.

Endpoints relevantes (demo)
- POST `/api/auth/login`  — demo-login: acepta cualquier email que contenga `@uleam` y devuelve un `access_token`.
- GET `/api/students`    — listado de estudiantes (protegido por token). Usado por el Dashboard.

Variables de entorno importantes (backend `.env`)
- DATABASE_URL (por defecto usa SQLite local `sqlite:///./edupredict.db`)
- ALLOW_ORIGINS (por defecto incluye `http://localhost:5175` para dev)

## Guía rápida — Frontend (Vite + React + Tailwind)
1. Abrir un terminal nuevo:

```bash
cd frontend
npm install
npm run dev
```

Por defecto Vite levanta el dev server en `http://127.0.0.1:5175`.
Si tu backend corre en otra dirección, crea un archivo `.env` en `frontend/` con:

```
VITE_API_URL=http://<tu-ip-o-host>:8000
VITE_SPLASH_DURATION=1000
```

Funcionalidades implementadas
- Splash con el logo de ULEAM (muestra ~1s antes de montar la app)
- Login demo en `/prediction` (introduce un email que contenga `@uleam`)
- Token guardado en `localStorage` y usado por `src/lib/api.js` para Authorization
- Dashboard que consume `/api/students`
- Diseño responsive con Tailwind y animaciones suaves en hero y cards

Estructura clave del frontend
- `src/main.jsx` — inicio, splash y providers (Theme / I18n)
- `src/lib/api.js` — instancia axios centralizada, `setToken()`, interceptores (manejo 401 y expiración)
- `src/components/Navbar.jsx` — navegación superior y control de tema/idioma
- `src/pages/*` — páginas (Home, Prediction, Dashboard, History, About, Contact)
- `public/uleam-logo.png` — logo que se muestra en splash y navbar

Cómo probar el login demo
1. Abrir el frontend en el navegador: http://127.0.0.1:5175
2. Ir a Predicción (o directamente `/prediction`) e ingresar un correo que contenga `@uleam` (ej.: `juan@uleam.edu`)
3. En caso de éxito, se guarda el token en `localStorage` y se redirecciona; ahora podrás acceder a `/dashboard` para ver `/api/students`.

Colaboración y flujo Git sugerido
- `main` — rama principal con releases estables
- `dev` — rama de integración para trabajo diario
- Crear ramas por feature: `feature/nombre-corto` y abrir Pull Requests hacia `dev`.

Cómo contribuir (rápido)
1. Haz fork del repo o pide acceso directo
2. Crea branch desde `dev`:

```bash
git checkout -b feature/mi-cambio
```

3. Haz commits pequeños y claros. Push a tu fork/branch y abre Pull Request (PR) describiendo cambios.

Puntos pendientes / Roadmap (sugerido)
- Tests E2E con Playwright (esqueleto incluido en `frontend/tests/`)
- Mejorar la autenticación real (OAuth o integración institucional)
- Migrar DB a PostgreSQL para ambientes de producción
- Mejorar accesibilidad y meta tags / favicon

Notas de despliegue (rápido)
- Para producción, construir frontend y servir con un CDN o servidor estático.
- Ajustar CORS y variables `DATABASE_URL` en el backend.

Contacto / Ayuda
- Siéntanse libres de abrir Issues en el repositorio o comentar en los PRs.

---

Este README fue actualizado automáticamente por el equipo de desarrollo. Si quieres que incluya pasos adicionales (por ejemplo CI con GitHub Actions, despliegue en Render/Heroku/Netlify) dime y lo agrego.
