"""Entrenamiento de los cuatro algoritmos supervisados y guardado del mejor modelo."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.tree import DecisionTreeClassifier

from .evaluate import build_confusion_matrix, evaluate_model
from .preprocessing import FEATURE_COLUMNS, prepare_dataset, rank_features

MODEL_PATH = Path(__file__).resolve().parent / "model.pkl"


def _build_pipeline(model, scaler: str = "standard") -> Pipeline:
    scaler_step = StandardScaler() if scaler == "standard" else MinMaxScaler()
    selector = SelectKBest(mutual_info_classif, k=min(len(FEATURE_COLUMNS), 5))
    return Pipeline([("scaler", scaler_step), ("selector", selector), ("model", model)])


def train_models(
    df=None,
    scaler: str = "standard",
    test_size: float = 0.2,
    random_state: int = 42,
) -> Dict:
    """
    Entrena Regresion Logistica, Decision Tree, Random Forest y KNN.
    Devuelve el bundle del mejor modelo (segun F1 y accuracy).
    """
    if df is None:
        df = prepare_dataset()

    X = df[FEATURE_COLUMNS]
    y = df["riesgo"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, stratify=y, random_state=random_state
    )

    candidates = {
        "logistic_regression": LogisticRegression(
            max_iter=1200, multi_class="auto", class_weight="balanced", solver="lbfgs"
        ),
        "decision_tree": DecisionTreeClassifier(
            max_depth=6, min_samples_split=6, random_state=random_state
        ),
        "random_forest": RandomForestClassifier(
            n_estimators=250,
            max_depth=9,
            min_samples_split=4,
            random_state=random_state,
            n_jobs=-1,
        ),
        "knn": KNeighborsClassifier(n_neighbors=7, weights="distance"),
    }

    feature_ranking = rank_features(X_train, y_train)
    results: Dict[str, Dict] = {}
    best_model_name: Optional[str] = None
    best_score = -1.0
    best_bundle: Optional[Dict] = None

    for name, estimator in candidates.items():
        pipeline = _build_pipeline(estimator, scaler=scaler)
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        metrics = evaluate_model(y_test, y_pred)
        cm = build_confusion_matrix(y_test, y_pred, labels=sorted(y.unique().tolist()))
        results[name] = {
            **metrics,
            "confusion_matrix": cm,
        }

        # score combinado para elegir mejor modelo
        score_global = metrics["f1_weighted"] + metrics["accuracy"]
        if score_global > best_score:
            best_score = score_global
            best_model_name = name
            best_bundle = {
                "model": pipeline,
                "metrics": metrics,
                "confusion_matrix": cm,
            }

    if not best_bundle or best_model_name is None:
        raise RuntimeError("No se pudo seleccionar un modelo entrenado")

    model_bundle = {
        **best_bundle,
        "feature_order": FEATURE_COLUMNS,
        "selected_features": [name for name, _ in feature_ranking[:5]],
        "all_metrics": results,
        "best_model": best_model_name,
        "trained_at": datetime.utcnow().isoformat(),
    }

    return model_bundle


def train_and_save_best_model(
    output_path: Path = MODEL_PATH, scaler: str = "standard"
) -> Dict:
    """Entrena y persiste el mejor modelo en disco."""
    model_bundle = train_models(scaler=scaler)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model_bundle, output_path)
    return model_bundle
