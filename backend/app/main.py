import os, numpy as np
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select, Session
from pydantic import BaseModel
from dotenv import load_dotenv

from .database import init_db, get_session
from .models import Student, User
from .schemas import LoginRequest, TokenResponse
from .auth import create_token, get_current_user

load_dotenv()

app = FastAPI(title="EduPredict API", version="1.0.0")
# default allowed origin: vite default port 5175 used by the frontend in this starter
origins = os.getenv("ALLOW_ORIGINS", "http://localhost:5175").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    # Simple demo: accept any password, require @uleam.edu.ec email
    if not payload.email or "@uleam" not in payload.email:
        raise HTTPException(status_code=401, detail="Solo cuentas ULEAM")
    # upsert user
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user:
        user = User(email=payload.email, full_name=payload.email.split("@")[0].title())
        session.add(user); session.commit()
    token = create_token(user.email)
    return TokenResponse(access_token=token)

class PredictRequest(BaseModel):
    name: str
    gpa: float
    attendance: float
    study_hours: float

class PredictResponse(BaseModel):
    risk_prob: float
    risk_label: int
    message: str

@app.post("/api/predict", response_model=PredictResponse)
def predict(req: PredictRequest, user=Depends(get_current_user), session: Session = Depends(get_session)):
    # simple heuristic: lower GPA & attendance -> higher risk
    x = np.array([req.gpa, req.attendance, req.study_hours], dtype=float)
    w = np.array([-2.0, -1.2, -0.4])
    b = 5.0
    z = float(w @ x + b)
    prob = 1.0 / (1.0 + np.exp(-z/10))
    label = int(prob > 0.5)
    # store sample
    st = Student(name=req.name, gpa=req.gpa, attendance=req.attendance, study_hours=req.study_hours, label=label)
    session.add(st); session.commit()
    msg = "Riesgo alto" if label else "Riesgo bajo"
    return PredictResponse(risk_prob=round(prob,3), risk_label=label, message=msg)

@app.get("/api/students")
def list_students(user=Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Student)).all()
