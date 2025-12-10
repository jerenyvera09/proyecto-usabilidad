"""Funciones de evaluacion de modelos."""

from __future__ import annotations

from typing import Dict, List

import numpy as np
from sklearn.metrics import accuracy_score, confusion_matrix, f1_score


def evaluate_model(y_true, y_pred) -> Dict[str, float]:
    """Calcula metricas requeridas: accuracy y F1-score ponderado."""
    return {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "f1_weighted": float(f1_score(y_true, y_pred, average="weighted")),
    }


def build_confusion_matrix(y_true, y_pred, labels: List[str]) -> Dict[str, list]:
    """Devuelve la matriz de confusion en forma serializable."""
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    return {
        "labels": labels,
        "matrix": cm.tolist(),
    }
