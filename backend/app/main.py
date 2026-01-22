"""
EduPredict - Sistema Web de Prediccion de Rendimiento Academico
Backend API REST con FastAPI + pipeline de IA (Regresion Logistica, Arboles
de Decision, Random Forest y KNN).
"""

from contextlib import asynccontextmanager  # <--- NUEVO IMPORT
from datetime import datetime, timedelta
import os
from typing import List, Optional

import jwt
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from passlib.context import CryptContext
from sqlmodel import Session, select

# Importamos la funcion que creaste en database.py para crear las tablas
from .database import create_db_and_tables, get_session
from .ml.utils import (
    build_pdf_report,
    generate_recommendations,
    get_model_report,
    load_or_train_model,
    normalize_payload,
    predict_with_model,
)
from .etl.institucional import build_training_dataset
from .models import (
    Prediccion,
    PrediccionCreate,
    PrediccionResponse,
    Usuario,
    UsuarioCreate,
    UsuarioLogin,
    UsuarioResponse,
)

# ============================================
# CONFIGURACION GLOBAL
# ============================================
SECRET_KEY = os.getenv("SECRET_KEY", "edupredict-uleam-2025-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

# Variables Globales
MODEL_BUNDLE = {}
SCHEDULER: Optional[BackgroundScheduler] = None

# ============================================
# LIFESPAN (INICIO Y CIERRE DE LA APP)
# ============================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Maneja el ciclo de vida de la aplicacion:
    1. Al iniciar: Crea tablas en BD (Supabase) y entrena/carga el modelo ML.
    2. Al apagar: Cierra el scheduler de tareas.
    """
    print("🚀 Iniciando EduPredict Backend...")
    
    # 1. CREAR TABLAS EN SUPABASE / POSTGRES / SQLITE
    # Esta linea es la que hace la magia de la migracion automatica
    try:
        create_db_and_tables()
        print("✅ Base de datos verificada/creada correctamente.")
    except Exception as e:
        print(f"❌ Error al crear tablas en BD: {e}")

    # 2. CARGAR O ENTRENAR MODELO ML
    global MODEL_BUNDLE
    MODEL_BUNDLE = load_or_train_model()
    print("🧠 Modelo de IA cargado y listo.")

    # 3. SCHEDULER (OPCIONAL)
    enable_auto_retrain = os.getenv("ENABLE_AUTO_RETRAIN", "false").lower() in {"1", "true", "yes"}
    if enable_auto_retrain:
        global SCHEDULER
        SCHEDULER = BackgroundScheduler()
        # Reentrenar el 1 de marzo y 1 de septiembre a las 02:00 UTC
        SCHEDULER.add_job(
            func=lambda: load_or_train_model(force_retrain=True),
            trigger=CronTrigger(month="3,9", day=1, hour=2, minute=0),
            name="auto-semester-retrain",
            replace_existing=True,
        )
        SCHEDULER.start()
        print("⏰ Auto-retrain habilitado (semestral)")

    yield  # <-- Aqui la aplicacion corre y recibe peticiones

    # 4. LIMPIEZA AL APAGAR
    if SCHEDULER:
        SCHEDULER.shutdown(wait=False)
    print("🛑 Apagando EduPredict Backend...")


# ============================================
# INICIALIZACION DE FASTAPI
# ============================================
app = FastAPI(
    title="EduPredict API",
    description="Sistema de Prediccion de Rendimiento Academico - ULEAM",
    version="1.1.0",
    lifespan=lifespan,  # <--- CONECTAMOS EL LIFESPAN AQUI
)

# CORS
origins = os.getenv(
    "ALLOW_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:5175,https://edupredict-frontend.up.railway.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# UTILIDADES DE SEGURIDAD
# ============================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session),
) -> Optional[Usuario]:
    """Obtiene al usuario autenticado a partir del JWT (si existe)."""
    if credentials is None:
        return None

    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Token invalido")

    usuario = session.exec(select(Usuario).where(Usuario.email == email)).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return usuario


def validar_payload(payload: dict):
    """Valida rangos numericos basicos de la peticion /predict."""
    if not (0 <= payload["promedio"] <= 10):
        raise HTTPException(status_code=400, detail="promedio debe estar entre 0 y 10")
    if not (0 <= payload["asistencia"] <= 100):
        raise HTTPException(status_code=400, detail="asistencia debe estar entre 0 y 100")
    if not (0 <= payload["horas_estudio"] <= 60):
        raise HTTPException(status_code=400, detail="horas_estudio debe estar entre 0 y 60")
    if not (-10 <= payload["tendencia"] <= 10):
        raise HTTPException(status_code=400, detail="tendencia fuera de rango (-10 a 10)")
    if not (0 <= payload["puntualidad"] <= 100):
        raise HTTPException(status_code=400, detail="puntualidad debe estar entre 0 y 100")
    if not (0 <= payload["habitos"] <= 10):
        raise HTTPException(status_code=400, detail="habitos debe estar entre 0 y 10")


# ============================================
# RUTAS - AUTENTICACION
# ============================================

@app.post("/api/auth/register", response_model=UsuarioResponse, tags=["Autenticacion"])
def registrar_usuario(usuario: UsuarioCreate, session: Session = Depends(get_session)):
    """Registrar nuevo usuario (dominio @uleam.edu.ec)."""
    if not usuario.email.endswith("@uleam.edu.ec"):
        raise HTTPException(status_code=400, detail="El email debe ser del dominio @uleam.edu.ec")

    if len(usuario.password) < 6:
        raise HTTPException(status_code=400, detail="La contrasena debe tener al menos 6 caracteres")

    existing = session.exec(select(Usuario).where(Usuario.email == usuario.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Este email ya esta registrado")

    db_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password_hash=get_password_hash(usuario.password),
        rol=usuario.rol or "estudiante",
    )

    session.add(db_usuario)
    session.commit()
    session.refresh(db_usuario)
    return db_usuario


@app.post("/api/auth/login", tags=["Autenticacion"])
def login(credentials: UsuarioLogin, session: Session = Depends(get_session)):
    """Login de usuario - retorna JWT."""
    usuario = session.exec(select(Usuario).where(Usuario.email == credentials.email)).first()

    if not usuario or not verify_password(credentials.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Email o contrasena incorrectos")

    access_token = create_access_token(data={"sub": usuario.email, "id": usuario.id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario": {  # <--- IMPORTANTE: Estandarizamos a 'usuario' para que cuadre con tu Frontend
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol,
        },
        # Mantenemos 'user' por si acaso alguna parte vieja del front lo usa, pero priorizamos 'usuario'
        "user": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol,
        }
    }


# ============================================
# RUTAS - PREDICCIONES
# ============================================

@app.post("/api/predict", response_model=PrediccionResponse, tags=["Predicciones"])
def crear_prediccion(
    prediccion: PrediccionCreate,
    session: Session = Depends(get_session),
    usuario: Optional[Usuario] = Depends(get_current_user),
):
    """Crear nueva prediccion de rendimiento academico."""
    global MODEL_BUNDLE
    if not MODEL_BUNDLE:
        MODEL_BUNDLE = load_or_train_model()

    payload = normalize_payload(prediccion.dict())
    validar_payload(payload)

    ml_result = predict_with_model(MODEL_BUNDLE, payload)
    recomendaciones = generate_recommendations(ml_result["riesgo"], payload)

    db_prediccion = Prediccion(
        usuario_id=prediccion.usuario_id or (usuario.id if usuario else None),
        promedio=payload["promedio"],
        asistencia=payload["asistencia"],
        horas_estudio=payload["horas_estudio"],
        tendencia=payload["tendencia"],
        puntualidad=payload["puntualidad"],
        habitos=payload["habitos"],
        riesgo=ml_result["riesgo"],
        score=ml_result["score"],
        recomendacion=" ".join(recomendaciones),
        modelo=MODEL_BUNDLE.get("best_model"),
    )

    session.add(db_prediccion)
    session.commit()
    session.refresh(db_prediccion)

    pdf_url = f"/api/predictions/{db_prediccion.id}/pdf"
    return {
        **db_prediccion.dict(),
        "recomendaciones": recomendaciones,
        "pdf_url": pdf_url,
        "alerta_docente": db_prediccion.riesgo == "alto",
        "probabilidades": ml_result.get("probabilidades", {}),
    }


@app.get("/api/predictions/{prediccion_id}/pdf", tags=["Predicciones"])
def descargar_pdf(prediccion_id: int, session: Session = Depends(get_session)):
    """Genera y descarga el PDF de una prediccion."""
    pred = session.get(Prediccion, prediccion_id)
    if not pred:
        raise HTTPException(status_code=404, detail="Prediccion no encontrada")

    buffer = build_pdf_report(pred.dict(), MODEL_BUNDLE)
    filename = f"reporte-prediccion-{prediccion_id}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@app.get("/api/students", response_model=List[PrediccionResponse], tags=["Predicciones"])
def listar_predicciones(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    """Listar todas las predicciones."""
    predicciones = session.exec(select(Prediccion).offset(skip).limit(limit)).all()
    return [
        {**p.dict(), "pdf_url": f"/api/predictions/{p.id}/pdf", "alerta_docente": p.riesgo == "alto"}
        for p in predicciones
    ]


@app.get("/api/students/{usuario_id}", response_model=List[PrediccionResponse], tags=["Predicciones"])
def listar_predicciones_usuario(usuario_id: int, session: Session = Depends(get_session)):
    """Listar predicciones de un usuario especifico."""
    predicciones = session.exec(select(Prediccion).where(Prediccion.usuario_id == usuario_id)).all()
    return [
        {**p.dict(), "pdf_url": f"/api/predictions/{p.id}/pdf", "alerta_docente": p.riesgo == "alto"}
        for p in predicciones
    ]


@app.get("/api/students/me/predicciones", response_model=List[PrediccionResponse], tags=["Predicciones"])
def listar_predicciones_me(
    session: Session = Depends(get_session),
    usuario: Usuario = Depends(get_current_user),
):
    """Historial de predicciones del usuario autenticado."""
    predicciones = session.exec(select(Prediccion).where(Prediccion.usuario_id == usuario.id)).all()
    return [
        {**p.dict(), "pdf_url": f"/api/predictions/{p.id}/pdf", "alerta_docente": p.riesgo == "alto"}
        for p in predicciones
    ]


# ============================================
# RUTAS - ESTADISTICAS Y MODELO
# ============================================

@app.get("/api/stats", tags=["Estadisticas"])
def obtener_estadisticas(session: Session = Depends(get_session)):
    """Estadisticas generales del sistema + distribucion de riesgo para dashboard."""
    total_usuarios = len(session.exec(select(Usuario)).all())
    predicciones = session.exec(select(Prediccion)).all()
    total_predicciones = len(predicciones)
    riesgo_alto = sum(1 for p in predicciones if p.riesgo == "alto")
    riesgo_medio = sum(1 for p in predicciones if p.riesgo == "medio")
    riesgo_bajo = sum(1 for p in predicciones if p.riesgo == "bajo")
    avg_score = sum(p.score for p in predicciones) / total_predicciones if predicciones else 0

    alerta_temprana = [p for p in predicciones if p.riesgo == "alto"]

    return {
        "total_usuarios": total_usuarios,
        "total_predicciones": total_predicciones,
        "riesgo_alto": riesgo_alto,
        "riesgo_medio": riesgo_medio,
        "riesgo_bajo": riesgo_bajo,
        "score_promedio": round(avg_score, 2),
        "alertas_tempranas": len(alerta_temprana),
        "modelo": get_model_report(MODEL_BUNDLE),
    }


@app.get("/api/model/metrics", tags=["Estadisticas"])
def metricas_modelo():
    """Metadatos del modelo entrenado."""
    if not MODEL_BUNDLE:
        raise HTTPException(status_code=503, detail="Modelo no cargado")
    return get_model_report(MODEL_BUNDLE)


@app.post("/api/model/retrain", tags=["Estadisticas"])
def reentrenar_modelo(usuario: Optional[Usuario] = Depends(get_current_user)):
    """Reentrena el modelo con los datos disponibles."""
    global MODEL_BUNDLE
    MODEL_BUNDLE = load_or_train_model(force_retrain=True)
    return {
        "message": "Modelo reentrenado",
        "modelo": get_model_report(MODEL_BUNDLE),
    }


@app.post("/api/etl/import", tags=["Estadisticas"])
def importar_datos_institucionales(
    notas_csv: Optional[str] = None,
    asistencia_csv: Optional[str] = None,
    actividades_csv: Optional[str] = None,
    materias_csv: Optional[str] = None,
    use_db: bool = False,
    usuario: Optional[Usuario] = Depends(get_current_user),
):
    """Importa datos institucionales y reentrena."""
    csv_config = {
        "notas": notas_csv,
        "asistencia": asistencia_csv,
        "actividades": actividades_csv,
        "materias": materias_csv,
    }

    df = build_training_dataset(csv_config=csv_config, use_db=use_db)
    if df.empty:
        raise HTTPException(status_code=400, detail="No se pudieron importar datos institucionales")

    from .ml.train_models import train_models

    global MODEL_BUNDLE
    MODEL_BUNDLE = train_models(df=df)
    return {
        "message": "Datos importados y modelo reentrenado",
        "registros": len(df),
        "modelo": get_model_report(MODEL_BUNDLE),
    }


# ============================================
# RUTA RAIZ Y HEALTH CHECK
# ============================================

@app.get("/", tags=["General"])
def root():
    return {
        "app": "EduPredict API",
        "version": "1.1.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["General"])
def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}