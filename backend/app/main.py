"""
EduPredict - Sistema de Predicción de Rendimiento Académico
Backend API REST con FastAPI
ULEAM 6A 2025-2
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List
import os
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

from .database import create_db_and_tables, get_session
from .models import (
    Usuario, UsuarioCreate, UsuarioLogin, UsuarioResponse,
    Prediccion, PrediccionCreate, PrediccionResponse
)

# Configuración
SECRET_KEY = os.getenv("SECRET_KEY", "edupredict-uleam-2025-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app = FastAPI(
    title="EduPredict API",
    description="Sistema de Predicción de Rendimiento Académico - ULEAM",
    version="1.0.0"
)

# CORS
origins = os.getenv("ALLOW_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar BD al arrancar
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    print("✅ Base de datos inicializada correctamente")

# ============================================
# UTILIDADES
# ============================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verificar contraseña"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash de contraseña"""
    return pwd_context.hash(password)

def create_access_token(data: dict):
    """Crear JWT token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def calcular_riesgo(nota_promedio: float, asistencia: int, horas_estudio: int) -> dict:
    """
    Algoritmo de predicción de riesgo académico
    Retorna: {"riesgo": "bajo|medio|alto", "score": 0-100, "recomendacion": "..."}
    """
    # Score ponderado (0-100)
    score_nota = (nota_promedio / 10) * 40  # 40% peso
    score_asistencia = (asistencia / 100) * 35  # 35% peso
    score_horas = min((horas_estudio / 20) * 25, 25)  # 25% peso (máx 20h)
    
    score_total = score_nota + score_asistencia + score_horas
    
    # Determinar riesgo
    if score_total >= 75:
        riesgo = "bajo"
        recomendacion = "Excelente desempeño. Mantén tus hábitos de estudio y asistencia."
    elif score_total >= 50:
        riesgo = "medio"
        recomendacion = "Buen progreso, pero puedes mejorar. Incrementa tus horas de estudio y asistencia."
    else:
        riesgo = "alto"
        recomendacion = "Se requiere intervención urgente. Consulta con tu tutor académico y ajusta tu plan de estudio."
    
    return {
        "riesgo": riesgo,
        "score": round(score_total, 2),
        "recomendacion": recomendacion
    }

# ============================================
# RUTAS - AUTENTICACIÓN
# ============================================

@app.post("/api/auth/register", response_model=UsuarioResponse, tags=["Autenticación"])
def registrar_usuario(usuario: UsuarioCreate, session: Session = Depends(get_session)):
    """
    Registrar nuevo usuario
    - Email debe ser @uleam.edu.ec
    - Contraseña mínimo 6 caracteres
    """
    # Validar email ULEAM
    if not usuario.email.endswith("@uleam.edu.ec"):
        raise HTTPException(
            status_code=400,
            detail="El email debe ser del dominio @uleam.edu.ec"
        )
    
    # Validar contraseña
    if len(usuario.password) < 6:
        raise HTTPException(
            status_code=400,
            detail="La contraseña debe tener al menos 6 caracteres"
        )
    
    # Verificar si el email ya existe
    existing = session.exec(select(Usuario).where(Usuario.email == usuario.email)).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Este email ya está registrado"
        )
    
    # Crear usuario
    db_usuario = Usuario(
        nombre=usuario.nombre,
        email=usuario.email,
        password_hash=get_password_hash(usuario.password),
        rol=usuario.rol or "estudiante"
    )
    
    session.add(db_usuario)
    session.commit()
    session.refresh(db_usuario)
    
    return db_usuario

@app.post("/api/auth/login", tags=["Autenticación"])
def login(credentials: UsuarioLogin, session: Session = Depends(get_session)):
    """
    Login de usuario
    Retorna JWT token
    """
    # Buscar usuario
    usuario = session.exec(select(Usuario).where(Usuario.email == credentials.email)).first()
    
    if not usuario or not verify_password(credentials.password, usuario.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Email o contraseña incorrectos"
        )
    
    # Crear token
    access_token = create_access_token(data={"sub": usuario.email, "id": usuario.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email,
            "rol": usuario.rol
        }
    }

# ============================================
# RUTAS - PREDICCIONES
# ============================================

@app.post("/api/predict", response_model=PrediccionResponse, tags=["Predicciones"])
def crear_prediccion(prediccion: PrediccionCreate, session: Session = Depends(get_session)):
    """
    Crear nueva predicción de rendimiento académico
    Recibe: nota_promedio (0-10), asistencia (0-100%), horas_estudio (0-50)
    """
    # Validaciones
    if not (0 <= prediccion.nota_promedio <= 10):
        raise HTTPException(status_code=400, detail="nota_promedio debe estar entre 0 y 10")
    if not (0 <= prediccion.asistencia <= 100):
        raise HTTPException(status_code=400, detail="asistencia debe estar entre 0 y 100")
    if not (0 <= prediccion.horas_estudio <= 50):
        raise HTTPException(status_code=400, detail="horas_estudio debe estar entre 0 y 50")
    
    # Calcular riesgo
    resultado = calcular_riesgo(
        prediccion.nota_promedio,
        prediccion.asistencia,
        prediccion.horas_estudio
    )
    
    # Guardar predicción
    db_prediccion = Prediccion(
        usuario_id=prediccion.usuario_id,
        nota_promedio=prediccion.nota_promedio,
        asistencia=prediccion.asistencia,
        horas_estudio=prediccion.horas_estudio,
        riesgo=resultado["riesgo"],
        score=resultado["score"],
        recomendacion=resultado["recomendacion"]
    )
    
    session.add(db_prediccion)
    session.commit()
    session.refresh(db_prediccion)
    
    return db_prediccion

@app.get("/api/students", response_model=List[PrediccionResponse], tags=["Predicciones"])
def listar_predicciones(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session)
):
    """
    Listar todas las predicciones
    Paginación con skip y limit
    """
    predicciones = session.exec(select(Prediccion).offset(skip).limit(limit)).all()
    return predicciones

@app.get("/api/students/{usuario_id}", response_model=List[PrediccionResponse], tags=["Predicciones"])
def listar_predicciones_usuario(usuario_id: int, session: Session = Depends(get_session)):
    """
    Listar predicciones de un usuario específico
    """
    predicciones = session.exec(
        select(Prediccion).where(Prediccion.usuario_id == usuario_id)
    ).all()
    return predicciones

# ============================================
# RUTAS - ESTADÍSTICAS
# ============================================

@app.get("/api/stats", tags=["Estadísticas"])
def obtener_estadisticas(session: Session = Depends(get_session)):
    """
    Obtener estadísticas generales del sistema
    """
    total_usuarios = len(session.exec(select(Usuario)).all())
    total_predicciones = len(session.exec(select(Prediccion)).all())
    
    # Contar por nivel de riesgo
    predicciones = session.exec(select(Prediccion)).all()
    riesgo_alto = sum(1 for p in predicciones if p.riesgo == "alto")
    riesgo_medio = sum(1 for p in predicciones if p.riesgo == "medio")
    riesgo_bajo = sum(1 for p in predicciones if p.riesgo == "bajo")
    
    # Promedio de score
    avg_score = sum(p.score for p in predicciones) / len(predicciones) if predicciones else 0
    
    return {
        "total_usuarios": total_usuarios,
        "total_predicciones": total_predicciones,
        "riesgo_alto": riesgo_alto,
        "riesgo_medio": riesgo_medio,
        "riesgo_bajo": riesgo_bajo,
        "score_promedio": round(avg_score, 2)
    }

# ============================================
# RUTA RAÍZ
# ============================================

@app.get("/", tags=["General"])
def root():
    """Endpoint raíz - Información de la API"""
    return {
        "app": "EduPredict API",
        "version": "1.0.0",
        "description": "Sistema de Predicción de Rendimiento Académico - ULEAM",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health", tags=["General"])
def health_check():
    """Health check endpoint"""
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}
