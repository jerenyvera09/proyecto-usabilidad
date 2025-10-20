"""
Configuración de Base de Datos
SQLModel + SQLite
"""

from sqlmodel import SQLModel, create_engine, Session
import os

# URL de la base de datos (SQLite)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./edupredict.db")

# Motor de BD con configuración para SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)

def create_db_and_tables():
    """Crear todas las tablas en la BD"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency para obtener sesión de BD"""
    with Session(engine) as session:
        yield session
