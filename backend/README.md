# Backend - EduPredict API

API REST construida con FastAPI que expone el pipeline de prediccion academica (Regresion Logistica, Decision Tree, Random Forest y KNN), genera reportes PDF y persiste el historial en SQLite.

## Instalacion

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

## Ejecucion

```bash
uvicorn app.main:app --reload --port 8000
```

El servidor crea la base SQLite en `./data/edupredict_v2.db` y carga/entrena el modelo en `app/ml/model.pkl` si no existe.

## Endpoints principales

- `POST /api/auth/register` - Registro (dominio @uleam.edu.ec).
- `POST /api/auth/login` - Login y entrega de JWT.
- `POST /api/predict` - Prediccion con payload `{horas_estudio, promedio, asistencia, tendencia, puntualidad, habitos}`. Devuelve riesgo (alto/medio/bajo), score, recomendaciones, URL de PDF y alertas.
- `GET /api/predictions/{id}/pdf` - Descargar reporte PDF de la prediccion.
- `GET /api/students` - Listado global de predicciones.
- `GET /api/students/{usuario_id}` - Historial por usuario.
- `GET /api/students/me/predicciones` - Historial del usuario autenticado (JWT).
- `GET /api/stats` - Dashboard de metricas (distribucion de riesgo, score promedio, alertas tempranas y metricas del modelo).
- `GET /api/model/metrics` - Metricas completas del modelo entrenado.

## Carpeta ML (`app/ml`)

- `preprocessing.py` - Limpieza, normalizacion y generacion de dataset sintetico.
- `train_models.py` - Entrena los 4 algoritmos y guarda el mejor en `model.pkl`.
- `evaluate.py` - Accuracy, F1 y matriz de confusion.
- `utils.py` - Carga del modelo, prediccion, recomendaciones y generacion de PDF.
- `model.pkl` - Modelo ya entrenado listo para usar.

Documentacion interactiva disponible en `/docs` y `/redoc`.
