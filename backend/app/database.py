"""
Configuracion de Base de Datos
SQLModel + SQLite
"""

from pathlib import Path
import os
from sqlmodel import SQLModel, create_engine, Session

# URL de la base de datos (SQLite)
DEFAULT_DB_PATH = Path("./data/edupredict_v2.db")
DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")

# Motor de BD con configuracion para SQLite
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def create_db_and_tables():
    """Crear todas las tablas en la BD"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency para obtener sesion de BD"""
    with Session(engine) as session:
        yield session
