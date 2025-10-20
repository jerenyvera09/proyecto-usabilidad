"""
Modelos de datos para EduPredict
SQLModel (SQLAlchemy + Pydantic)
"""

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

# ============================================
# MODELOS DE USUARIO
# ============================================

class Usuario(SQLModel, table=True):
    """Modelo de Usuario en BD"""
    __tablename__ = "usuarios"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100)
    email: str = Field(unique=True, index=True, max_length=100)
    password_hash: str = Field(max_length=255)
    rol: str = Field(default="estudiante", max_length=20)  # estudiante, docente, admin
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UsuarioCreate(SQLModel):
    """Schema para crear usuario"""
    nombre: str
    email: str
    password: str
    rol: Optional[str] = "estudiante"

class UsuarioLogin(SQLModel):
    """Schema para login"""
    email: str
    password: str

class UsuarioResponse(SQLModel):
    """Schema de respuesta de usuario (sin password)"""
    id: int
    nombre: str
    email: str
    rol: str
    created_at: datetime

# ============================================
# MODELOS DE PREDICCIÓN
# ============================================

class Prediccion(SQLModel, table=True):
    """Modelo de Predicción en BD"""
    __tablename__ = "predicciones"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario_id: Optional[int] = Field(default=None, foreign_key="usuarios.id")
    nota_promedio: float = Field(ge=0, le=10)  # 0-10
    asistencia: int = Field(ge=0, le=100)  # 0-100%
    horas_estudio: int = Field(ge=0, le=50)  # 0-50 horas/semana
    riesgo: str = Field(max_length=20)  # bajo, medio, alto
    score: float = Field(ge=0, le=100)  # score calculado 0-100
    recomendacion: str = Field(max_length=500)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PrediccionCreate(SQLModel):
    """Schema para crear predicción"""
    usuario_id: Optional[int] = None
    nota_promedio: float
    asistencia: int
    horas_estudio: int

class PrediccionResponse(SQLModel):
    """Schema de respuesta de predicción"""
    id: int
    usuario_id: Optional[int]
    nota_promedio: float
    asistencia: int
    horas_estudio: int
    riesgo: str
    score: float
    recomendacion: str
    created_at: datetime
