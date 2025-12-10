"""Preprocesamiento y generacion de datos synthetic para el modelo IA."""

from __future__ import annotations

from pathlib import Path
from typing import Iterable, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.feature_selection import mutual_info_classif

# Caracteristicas esperadas por el pipeline
FEATURE_COLUMNS: List[str] = [
    "promedio",
    "asistencia",
    "horas_estudio",
    "tendencia",
    "puntualidad",
    "habitos",
]


def load_from_sources(
    web_data: Optional[Iterable[dict]] = None,
    csv_paths: Optional[Iterable[str]] = None,
) -> pd.DataFrame:
    """
    Carga y unifica datos provenientes del sistema web y archivos CSV externos.
    """
    frames: List[pd.DataFrame] = []

    if web_data:
        frames.append(pd.DataFrame(web_data))

    if csv_paths:
        for path in csv_paths:
            csv_file = Path(path)
            if csv_file.exists():
                frames.append(pd.read_csv(csv_file))

    if not frames:
        return pd.DataFrame()

    return pd.concat(frames, ignore_index=True)


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Limpia el dataset eliminando duplicados y completando valores faltantes.
    """
    if df.empty:
        return df

    df = df.drop_duplicates().copy()

    for col in df.columns:
        if pd.api.types.is_numeric_dtype(df[col]):
            df[col] = df[col].fillna(df[col].median())
        else:
            df[col] = df[col].fillna(df[col].mode().iloc[0])

    return df


def ensure_feature_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Garantiza que todas las columnas esperadas existan en el dataframe."""
    df = df.copy()
    for col in FEATURE_COLUMNS:
        if col not in df.columns:
            df[col] = 0
    return df


def generate_synthetic_students(
    n_samples: int = 800, random_state: int = 42
) -> pd.DataFrame:
    """
    Genera un dataset sintético que mezcla calificaciones, asistencia
    y hábitos de estudio para entrenar los modelos requeridos.
    """
    rng = np.random.default_rng(random_state)

    promedio = np.clip(rng.normal(7.2, 1.4, n_samples), 0, 10)
    asistencia = np.clip(rng.normal(86, 9, n_samples), 40, 100)
    horas_estudio = np.clip(rng.normal(12, 5, n_samples), 0, 50)
    tendencia = np.clip(rng.normal(0.2, 1.2, n_samples), -3, 3)
    puntualidad = np.clip(rng.normal(88, 8, n_samples), 40, 100)
    habitos = np.clip(rng.normal(7.0, 2.0, n_samples), 0, 10)

    # Score base ponderado (0-10) para etiquetar riesgo
    score_base = (
        promedio * 0.35
        + (asistencia / 10) * 0.2
        + (horas_estudio / 10) * 0.15
        + (puntualidad / 10) * 0.15
        + habitos * 0.1
        + tendencia * 0.5
    )

    score_base = np.interp(score_base, (score_base.min(), score_base.max()), (0, 10))

    riesgo = np.where(score_base >= 7.5, "bajo", np.where(score_base >= 5.5, "medio", "alto"))

    data = pd.DataFrame(
        {
            "promedio": promedio,
            "asistencia": asistencia,
            "horas_estudio": horas_estudio,
            "tendencia": tendencia,
            "puntualidad": puntualidad,
            "habitos": habitos,
            "riesgo": riesgo,
        }
    )
    return data


def prepare_dataset(
    web_data: Optional[Iterable[dict]] = None,
    csv_paths: Optional[Iterable[str]] = None,
    synthetic_if_empty: bool = True,
) -> pd.DataFrame:
    """
    Carga, limpia y asegura las caracteristicas necesarias. Si no hay datos,
    genera un dataset sintético.
    """
    df = load_from_sources(web_data, csv_paths)
    df = clean_dataset(df)

    if df.empty and synthetic_if_empty:
        df = generate_synthetic_students()

    df = ensure_feature_columns(df)
    return df


def rank_features(X: pd.DataFrame, y: pd.Series) -> List[Tuple[str, float]]:
    """
    Calcula la relevancia de cada variable usando mutual information.
    Retorna una lista ordenada descendentemente.
    """
    scores = mutual_info_classif(X, y, random_state=42)
    ranking = sorted(zip(X.columns, scores), key=lambda pair: pair[1], reverse=True)
    return ranking
