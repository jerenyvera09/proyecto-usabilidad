"""ETL institucional: carga datos de BD/CSV académico y mapea a FEATURE_COLUMNS.

Soporta:
- Conexión opcional a BD institucional vía DSN (env INSTITUTIONAL_DB_DSN)
- Ingesta de CSVs del sistema académico (notas, asistencia, actividades)
- Transformación/mapeo a las variables del modelo: promedio, asistencia, horas_estudio,
  tendencia, puntualidad, habitos, y etiqueta de riesgo opcional si existe.

Nota: Este módulo está diseñado para ser extendido con los nombres reales de tablas/columnas.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Dict, Iterable, List, Optional

import numpy as np
import pandas as pd

# Columnas esperadas por el modelo
FEATURE_COLUMNS = [
    "promedio",
    "asistencia",
    "horas_estudio",
    "tendencia",
    "puntualidad",
    "habitos",
]


def _safe_read_csv(path: Path) -> pd.DataFrame:
    try:
        return pd.read_csv(path)
    except Exception:
        return pd.DataFrame()


def import_from_csvs(
    notas_csv: Optional[str] = None,
    asistencia_csv: Optional[str] = None,
    actividades_csv: Optional[str] = None,
    materias_csv: Optional[str] = None,
) -> pd.DataFrame:
    """Importa datos desde CSV institucionales y realiza un mapeo a las features del modelo.

    Se asume un esquema flexible; se intentan nombres comunes de columnas y se normalizan.
    """
    frames: List[pd.DataFrame] = []

    # Lecturas seguras
    if notas_csv:
        df_notas = _safe_read_csv(Path(notas_csv))
        frames.append(df_notas)
    if asistencia_csv:
        df_asistencia = _safe_read_csv(Path(asistencia_csv))
        frames.append(df_asistencia)
    if actividades_csv:
        df_acts = _safe_read_csv(Path(actividades_csv))
        frames.append(df_acts)
    if materias_csv:
        df_mats = _safe_read_csv(Path(materias_csv))
        frames.append(df_mats)

    if not frames:
        return pd.DataFrame(columns=FEATURE_COLUMNS)

    raw = pd.concat(frames, ignore_index=True)

    # Mapeo heurístico de columnas posibles a las features
    def pick(cols: Iterable[str], candidates: Iterable[str], default=np.nan):
        for c in candidates:
            if c in cols:
                return c
        return None

    cols = set(raw.columns)
    col_promedio = pick(cols, ["promedio", "nota_promedio", "prom_general", "media"])
    col_asistencia = pick(cols, ["asistencia", "porc_asistencia", "attendance"], 0)
    col_puntualidad = pick(cols, ["puntualidad", "on_time_pct", "entregas_puntuales"], 0)
    col_horas = pick(cols, ["horas_estudio", "study_hours", "hrs_estudio"], 0)
    col_tendencia = pick(cols, ["tendencia", "trend", "variacion"], 0)
    col_habitos = pick(cols, ["habitos", "habitos_estudio", "study_habits"], 0)

    df = pd.DataFrame()
    df["promedio"] = pd.to_numeric(raw.get(col_promedio, pd.Series([np.nan] * len(raw)))),
    df["asistencia"] = pd.to_numeric(raw.get(col_asistencia, pd.Series([np.nan] * len(raw))))
    df["puntualidad"] = pd.to_numeric(raw.get(col_puntualidad, pd.Series([np.nan] * len(raw))))
    df["horas_estudio"] = pd.to_numeric(raw.get(col_horas, pd.Series([np.nan] * len(raw))))
    df["tendencia"] = pd.to_numeric(raw.get(col_tendencia, pd.Series([np.nan] * len(raw))))
    df["habitos"] = pd.to_numeric(raw.get(col_habitos, pd.Series([np.nan] * len(raw))))

    # Completar faltantes con valores razonables
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = np.nan
        if df[col].isna().all():
            # Defaults conservadores
            default = {
                "promedio": 7.0,
                "asistencia": 85.0,
                "puntualidad": 85.0,
                "horas_estudio": 10.0,
                "tendencia": 0.0,
                "habitos": 6.5,
            }[col]
            df[col] = default
        else:
            df[col] = df[col].fillna(df[col].median())

    return df[FEATURE_COLUMNS]


def import_from_db(dsn: Optional[str] = None) -> pd.DataFrame:
    """Plantilla para importar desde BD institucional.

    Por defecto, devuelve vacío. Para usar, implementar queries según el esquema real.
    """
    dsn = dsn or os.getenv("INSTITUTIONAL_DB_DSN")
    if not dsn:
        return pd.DataFrame(columns=FEATURE_COLUMNS)

    # Ejemplo: conectar con sqlalchemy/pyodbc y mapear tablas reales.
    # Aquí se deja como stub para no romper el entorno.
    return pd.DataFrame(columns=FEATURE_COLUMNS)


def build_training_dataset(
    csv_config: Optional[Dict[str, str]] = None,
    use_db: bool = False,
) -> pd.DataFrame:
    """Construye un dataset de entrenamiento combinando CSV y/o BD institucional."""
    csv_config = csv_config or {}
    df_csv = import_from_csvs(
        notas_csv=csv_config.get("notas"),
        asistencia_csv=csv_config.get("asistencia"),
        actividades_csv=csv_config.get("actividades"),
        materias_csv=csv_config.get("materias"),
    )
    df_db = import_from_db() if use_db else pd.DataFrame(columns=FEATURE_COLUMNS)

    if df_csv.empty and df_db.empty:
        return pd.DataFrame(columns=FEATURE_COLUMNS)

    df = pd.concat([df_csv, df_db], ignore_index=True)
    return df
