from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: str = ""
    role: str = "teacher"  # teacher|admin

class Student(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    gpa: float
    attendance: float
    study_hours: float
    label: Optional[int] = 0  # 1 risk, 0 ok
