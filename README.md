# EduPredict (Starter 2025)

## Backend (FastAPI)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env    # opcional, o usa variables de entorno
uvicorn app.main:app --reload --port 8000
```

## Frontend (Vite + React + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
El frontend asume la API en `http://localhost:8000`. Para cambiar, crea `.env` con `VITE_API_URL`.

### Splash / Carga
Al abrir el frontend verás un splash con el logo ULEAM ~1s antes de mostrar la app.

### Autenticación (demo)
En **Predicción**, ingresa un correo que contenga `@uleam` para iniciar sesión. Se guarda token en `localStorage` y luego podrás consumir `/api/predict` y listar `/api/students` en el Dashboard.

### Notas
- DB SQLite por defecto (`edupredict.db`). Cambia `DATABASE_URL` si quieres PostgreSQL.
- Código organizado y simple para expandir.
