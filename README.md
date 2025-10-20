# 🎓 EduPredict - Sistema de Predicción de Rendimiento Académico

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![WCAG](https://img.shields.io/badge/WCAG-2.2%20AA-purple)
![Status](https://img.shields.io/badge/status-production-success)

> **Sistema inteligente de predicción de rendimiento académico desarrollado para la Universidad Laica Eloy Alfaro de Manabí (ULEAM)**

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Accesibilidad](#-accesibilidad)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Evaluación de Usabilidad](#-evaluación-de-usabilidad)
- [Licencia](#-licencia)

---

## ✨ Características

### 🎯 Funcionalidades Principales

- ✅ **Predicción de Rendimiento**: Algoritmo inteligente que analiza 3 factores clave
  - 📊 Nota promedio (0-10)
  - ✅ Porcentaje de asistencia (0-100%)
  - 📚 Horas de estudio semanal (0-50h)
- 🔐 **Autenticación JWT**: Registro e inicio de sesión seguro
- 📜 **Historial de Predicciones**: Visualización de todas tus predicciones anteriores
- 📊 **Dashboard Interactivo**: Estadísticas personalizadas en tiempo real
- 🌐 **Multiidioma**: Español e Inglés (i18n completo)
- 🌙 **Modo Oscuro**: Theme switcher con persistencia

### ♿ Accesibilidad WCAG 2.2 Level AA

- 🎨 **Alto Contraste**: Ratio mínimo 4.5:1
- 🔠 **Ajuste de Texto**: Tamaño normal/grande
- 📖 **Modo Lectura**: Espaciado mejorado
- ⏸️ **Control de Animaciones**: Pausar/reanudar
- 🔊 **TTS (Text-to-Speech)**: Web Speech API integrada
- ⌨️ **Navegación por Teclado**: 100% tabulable
- 🎯 **Focus Visible**: Indicadores claros de foco

### 🎨 Diseño Moderno 2025

- 💜 **Color Primario**: #8B5CF6 (Purple)
- 🌈 **Gradientes**: Backgrounds dinámicos
- 🪄 **Animaciones**: Framer Motion
- 📱 **Responsive**: Mobile-first design
- 🔄 **Transiciones Suaves**: 60 FPS
- 🏷️ **TailwindCSS**: Utility-first CSS

---

## 🛠️ Tecnologías

### Frontend

```json
{
  "react": "^18.3.1",
  "vite": "^5.4.6",
  "tailwindcss": "^3.4.11",
  "framer-motion": "^11.5.4",
  "react-router-dom": "^6.26.2",
  "axios": "^1.7.7"
}
```

### Backend

```python
fastapi==0.104.1
sqlmodel==0.0.14
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
uvicorn[standard]==0.24.0
```

### Base de Datos

- **SQLite**: Base de datos ligera y eficiente

---

## 📦 Instalación

### Requisitos Previos

- **Node.js** >= 18.0.0
- **Python** >= 3.11
- **npm** o **yarn**
- **pip**

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/uleam/edupredict.git
cd edupredict
```

### 2️⃣ Configurar el Backend

```bash
# Navegar a la carpeta del backend
cd backend-new

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Iniciar servidor
uvicorn app.main:app --reload
```

El backend estará disponible en: **http://localhost:8000**  
Documentación API (Swagger): **http://localhost:8000/docs**

### 3️⃣ Configurar el Frontend

```bash
# Navegar a la carpeta del frontend
cd frontend-new

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

---

## 🚀 Uso

### 📝 Registro de Usuario

1. Navega a `/usuarios`
2. Haz clic en "Registrarse"
3. Completa el formulario con:
   - Nombre completo
   - Email institucional (@uleam.edu.ec)
   - Contraseña (mínimo 6 caracteres)
4. Confirma tu contraseña
5. Haz clic en "Registrarse"

### 🔑 Inicio de Sesión

1. Navega a `/usuarios`
2. Ingresa tu email y contraseña
3. Haz clic en "Iniciar Sesión"

### 🎯 Realizar una Predicción

1. Inicia sesión
2. Navega a `/dashboard`
3. Completa el formulario:
   - **Nota Promedio**: Tu promedio actual (0-10)
   - **Asistencia**: Porcentaje de asistencia (0-100%)
   - **Horas de Estudio**: Horas semanales (0-50h)
4. Haz clic en "Calcular Predicción"
5. Visualiza tu resultado:
   - **Riesgo**: Bajo 🟢 / Medio 🟡 / Alto 🔴
   - **Score**: Puntuación 0-100
   - **Recomendación**: Sugerencias personalizadas

### 📜 Ver Historial

1. Navega a `/historial`
2. Visualiza todas tus predicciones anteriores
3. Revisa tu progreso en el tiempo

### ♿ Activar Funciones de Accesibilidad

1. Haz clic en el botón flotante **♿** (esquina inferior derecha)
2. Activa/desactiva las funciones que necesites:
   - 🎨 Alto Contraste
   - 🔠 Texto Grande
   - 📖 Modo Lectura
   - ⏸️ Pausar Animaciones
   - 🔊 Texto a Voz (TTS)

---

## ♿ Accesibilidad

EduPredict cumple con **WCAG 2.2 Level AA**:

### ✅ Cumplimiento de Directrices

| Directriz                           | Nivel | Estado          |
| ----------------------------------- | ----- | --------------- |
| Contraste de color (1.4.3)          | AA    | ✅ 4.5:1 mínimo |
| Redimensionamiento de texto (1.4.4) | AA    | ✅ 200%         |
| Teclado (2.1.1)                     | A     | ✅ Completo     |
| Foco visible (2.4.7)                | AA    | ✅ Outline 3px  |
| Etiquetas (3.3.2)                   | A     | ✅ ARIA labels  |
| Idioma de página (3.1.1)            | A     | ✅ lang="es"    |

### 🎤 Text-to-Speech (TTS)

```javascript
// Ejemplo de uso
import { useAccessibility } from "./contexts/AccessibilityContext";

const { speak, stopSpeaking } = useAccessibility();

// Leer texto
speak("Hola, bienvenido a EduPredict");

// Detener lectura
stopSpeaking();
```

---

## 📁 Estructura del Proyecto

```
edupredict/
├── backend-new/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app principal
│   │   ├── models.py        # Modelos SQLModel
│   │   ├── database.py      # Configuración BD
│   │   └── __pycache__/
│   ├── .env                 # Variables de entorno
│   ├── requirements.txt
│   └── README.md
│
├── frontend-new/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SplashScreen.jsx
│   │   │   └── AccessibilityButton.jsx
│   │   ├── contexts/
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── I18nContext.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   └── AccessibilityContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Usuarios.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Historial.jsx
│   │   │   ├── Accesibilidad.jsx
│   │   │   ├── About.jsx
│   │   │   └── Contact.jsx
│   │   ├── lib/
│   │   │   └── api.js        # Axios configurado
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── docs/
    └── CHECKLIST_USABILIDAD.md
```

---

## 🔌 API Endpoints

### Autenticación

#### POST `/api/auth/register`

Registra un nuevo usuario.

**Request Body:**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan.perez@uleam.edu.ec",
  "password": "password123"
}
```

**Response:**

```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan.perez@uleam.edu.ec",
  "rol": "estudiante"
}
```

#### POST `/api/auth/login`

Inicia sesión y obtiene token JWT.

**Request Body:**

```json
{
  "email": "juan.perez@uleam.edu.ec",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan.perez@uleam.edu.ec"
  }
}
```

### Predicciones

#### POST `/api/predict`

Crea una nueva predicción.

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "nota_promedio": 8.5,
  "asistencia": 85,
  "horas_estudio": 15
}
```

**Response:**

```json
{
  "id": 1,
  "usuario_id": 1,
  "nota_promedio": 8.5,
  "asistencia": 85,
  "horas_estudio": 15,
  "riesgo": "bajo",
  "score": 85.75,
  "recomendacion": "Excelente rendimiento. Mantén tu esfuerzo actual.",
  "created_at": "2025-01-15T10:30:00"
}
```

#### GET `/api/students/me/predicciones`

Obtiene el historial de predicciones del usuario autenticado.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": 1,
    "nota_promedio": 8.5,
    "asistencia": 85,
    "horas_estudio": 15,
    "riesgo": "bajo",
    "score": 85.75,
    "recomendacion": "...",
    "created_at": "2025-01-15T10:30:00"
  }
]
```

#### GET `/api/stats`

Obtiene estadísticas del usuario autenticado.

**Response:**

```json
{
  "total_predicciones": 5,
  "promedio_score": 82.5,
  "ultima_prediccion": "2025-01-15T10:30:00"
}
```

---

## 📸 Capturas de Pantalla

### 🏠 Página de Inicio

Diseño moderno con gradientes y animaciones de entrada.

### 🎯 Dashboard

Formulario de predicción con validación en tiempo real.

### 📜 Historial

Vista detallada de todas las predicciones con badges de riesgo.

### ♿ Accesibilidad

Menú flotante con todas las funciones de accesibilidad.

---

## 📊 Evaluación de Usabilidad

**Ver documento completo**: [docs/CHECKLIST_USABILIDAD.md](./docs/CHECKLIST_USABILIDAD.md)

### Resumen de Evaluación

| Categoría         | Puntuación | Estado          |
| ----------------- | ---------- | --------------- |
| **Usabilidad**    | 5/5        | ✅ Excelente    |
| **Accesibilidad** | 5/5        | ✅ Excelente    |
| **TOTAL**         | **10/10**  | ✅ **APROBADO** |

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

---

## 👥 Equipo

**Universidad Laica Eloy Alfaro de Manabí (ULEAM)**  
Manta, Manabí, Ecuador

📧 Email: info@uleam.edu.ec  
📞 Teléfono: +593 5 262 3740  
🌐 Web: https://www.uleam.edu.ec

---

## 🙏 Agradecimientos

- **ULEAM** - Por proporcionar el entorno educativo
- **React Team** - Por el framework increíble
- **FastAPI** - Por la API ultra-rápida
- **TailwindCSS** - Por el sistema de diseño
- **Framer Motion** - Por las animaciones fluidas

---

## 📚 Documentación Adicional

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

---

## 🔗 Enlaces Útiles

- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173

---

<div align="center">

**Desarrollado con ❤️ para ULEAM**

![ULEAM](https://img.shields.io/badge/ULEAM-2025-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC?logo=tailwind-css)

</div>
