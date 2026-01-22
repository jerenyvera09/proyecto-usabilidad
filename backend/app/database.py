"""
Configuracion de Base de Datos
Soporta: SQLModel + SQLite (Local) y PostgreSQL (Producción/Supabase)
"""

from pathlib import Path
import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv  # <--- 1. NUEVO IMPORT

# 2. CARGAR VARIABLES DE ENTORNO
# Esto busca el archivo .env y carga las variables en os.getenv
load_dotenv() 

# 1. Intentar obtener la URL de la nube (Variable de entorno)
DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Lógica de selección de Base de Datos
if DATABASE_URL:
    # CASO PRODUCCIÓN (Supabase / Postgres)
    # Fix: SQLAlchemy necesita 'postgresql://' pero algunos providers dan 'postgres://'
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # Postgres no necesita argumentos especiales de hilos
    connect_args = {}
    print("🌍 Conectando a Base de Datos en la NUBE (PostgreSQL)")

else:
    # CASO LOCAL (SQLite) - Fallback
    DEFAULT_DB_PATH = Path("./data/edupredict_v2.db")
    DEFAULT_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    DATABASE_URL = f"sqlite:///{DEFAULT_DB_PATH}"
    
    # SQLite necesita esto para trabajar con FastAPI
    connect_args = {"check_same_thread": False}
    print("🏠 Conectando a Base de Datos LOCAL (SQLite)")

# 3. Crear el motor de la base de datos
engine = create_engine(DATABASE_URL, echo=False, connect_args=connect_args)


def create_db_and_tables():
    """Crear todas las tablas en la BD si no existen"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency para obtener sesion de BD en cada request"""
    with Session(engine) as session:
        yield session