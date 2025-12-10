"""Utilidades para carga del modelo, prediccion y generacion de reportes PDF."""

from __future__ import annotations

from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import Dict, Iterable, List, Optional

import joblib
import pandas as pd
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

from .preprocessing import FEATURE_COLUMNS, prepare_dataset
from .train_models import MODEL_PATH, train_and_save_best_model


def load_or_train_model(force_retrain: bool = False, model_path: Path = MODEL_PATH) -> Dict:
    """Carga el modelo desde disco o entrena uno nuevo si no existe."""
    if model_path.exists() and not force_retrain:
        return joblib.load(model_path)

    model_path.parent.mkdir(parents=True, exist_ok=True)
    return train_and_save_best_model(output_path=model_path)


def normalize_payload(payload: Dict) -> Dict:
    """Garantiza tipos numericos y columnas esperadas."""
    if "promedio" not in payload and "nota_promedio" in payload:
        payload["promedio"] = payload.get("nota_promedio", 0)

    normalized = {}
    for key in FEATURE_COLUMNS:
        value = payload.get(key, 0)
        try:
            normalized[key] = float(value)
        except (TypeError, ValueError):
            normalized[key] = 0.0
    return normalized


def predict_with_model(model_bundle: Dict, payload: Dict) -> Dict:
    """
    Realiza la prediccion usando el modelo entrenado.
    Retorna riesgo, score (0-100) y probabilidades por clase.
    """
    if not model_bundle:
        raise RuntimeError("Modelo no disponible")

    normalized = normalize_payload(payload)
    feature_order = model_bundle.get("feature_order", FEATURE_COLUMNS)
    model = model_bundle["model"]

    df = pd.DataFrame([normalized], columns=feature_order)
    predicted = model.predict(df)[0]

    probabilities: Dict[str, float] = {}
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(df)[0]
        for cls, prob in zip(model.classes_, proba):
            probabilities[str(cls)] = float(prob)
    else:
        probabilities[str(predicted)] = 1.0

    score = round(max(probabilities.values()) * 100, 2)
    return {
        "riesgo": str(predicted),
        "score": score,
        "probabilidades": probabilities,
    }


def generate_recommendations(riesgo: str, payload: Dict) -> List[str]:
    """Recomendaciones basadas en el nivel de riesgo y las variables clave."""
    promedio = payload.get("promedio", 0)
    asistencia = payload.get("asistencia", 0)
    horas_estudio = payload.get("horas_estudio", 0)
    tendencia = payload.get("tendencia", 0)
    puntualidad = payload.get("puntualidad", 0)
    habitos = payload.get("habitos", 0)

    recs: List[str] = []
    if riesgo == "alto":
        recs.append("Agendar tutorias semanales y sesiones de refuerzo en las asignaturas con menor promedio.")
        if asistencia < 80:
            recs.append("Regulariza tu asistencia y solicita seguimiento a docentes para evitar atrasos.")
        if horas_estudio < 10:
            recs.append("Incrementa progresivamente tus horas de estudio a al menos 10-12 horas semanales.")
    elif riesgo == "medio":
        recs.append("Mantén constancia con un plan de estudio estructurado y descansos programados.")
        if tendencia < 0:
            recs.append("Revisa unidades pendientes y repasa exámenes previos para revertir la tendencia negativa.")
        recs.append("Prioriza tareas críticas y registra avances en un planner académico.")
    else:
        recs.append("Excelente desempeño. Continúa con tus hábitos actuales y apóyate en grupos de estudio.")
        if puntualidad < 90:
            recs.append("Refuerza la puntualidad para consolidar el buen rendimiento.")
        recs.append("Explora material avanzado o proyectos extracurriculares para seguir creciendo.")

    if habitos < 6:
        recs.append("Implementa técnicas Pomodoro y espacios de estudio sin distracciones para mejorar hábitos.")

    return recs


def build_pdf_report(prediccion: Dict, model_bundle: Dict) -> BytesIO:
    """Genera un PDF con el resultado de la prediccion y las recomendaciones."""
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    margin = 0.8 * inch

    pdf.setTitle("Reporte de Prediccion Académica")

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(margin, height - margin, "Sistema Web de Prediccion de Rendimiento Academico")
    pdf.setFont("Helvetica", 10)
    pdf.drawString(margin, height - margin - 14, f"Generado: {datetime.utcnow().isoformat()} UTC")

    y = height - margin - 40
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(margin, y, "Resultado")
    pdf.setFont("Helvetica", 11)
    pdf.drawString(margin, y - 16, f"Riesgo: {prediccion.get('riesgo', '').upper()}")
    pdf.drawString(margin, y - 32, f"Score: {prediccion.get('score', 0)} / 100")
    if prediccion.get("modelo"):
        pdf.drawString(margin, y - 48, f"Modelo: {prediccion['modelo']}")

    y -= 80
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(margin, y, "Variables de entrada")
    pdf.setFont("Helvetica", 10)
    y -= 16
    for label, key in [
        ("Promedio", "promedio"),
        ("Asistencia (%)", "asistencia"),
        ("Horas de estudio", "horas_estudio"),
        ("Tendencia", "tendencia"),
        ("Puntualidad (%)", "puntualidad"),
        ("Habitos", "habitos"),
    ]:
        pdf.drawString(margin, y, f"- {label}: {prediccion.get(key, 'N/A')}")
        y -= 14

    y -= 10
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(margin, y, "Recomendaciones personalizadas")
    pdf.setFont("Helvetica", 10)
    y -= 16
    recomendaciones = prediccion.get("recomendaciones") or prediccion.get("recomendacion") or []
    if isinstance(recomendaciones, str):
        recomendaciones = [recomendaciones]
    for rec in recomendaciones:
        pdf.drawString(margin + 10, y, f"• {rec}")
        y -= 14
        if y < margin + 40:
            pdf.showPage()
            y = height - margin
            pdf.setFont("Helvetica", 10)

    # Panel de métricas del modelo
    y -= 10
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(margin, y, "Métricas del modelo")
    y -= 16
    metrics = (model_bundle or {}).get("metrics", {})
    pdf.setFont("Helvetica", 10)
    pdf.drawString(margin, y, f"Accuracy: {metrics.get('accuracy', 0):.3f}")
    y -= 14
    pdf.drawString(margin, y, f"F1-score (ponderado): {metrics.get('f1_weighted', 0):.3f}")

    pdf.showPage()
    pdf.save()
    buffer.seek(0)
    return buffer


def get_model_report(model_bundle: Dict) -> Dict:
    """Devuelve metadatos del modelo serializables para el dashboard."""
    return {
        "best_model": model_bundle.get("best_model"),
        "trained_at": model_bundle.get("trained_at"),
        "metrics": model_bundle.get("metrics", {}),
        "all_metrics": model_bundle.get("all_metrics", {}),
        "feature_order": model_bundle.get("feature_order", FEATURE_COLUMNS),
        "selected_features": model_bundle.get("selected_features", FEATURE_COLUMNS),
    }
