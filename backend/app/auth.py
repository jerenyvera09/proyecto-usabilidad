import os, time, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET = os.getenv("SECRET_KEY", "dev-key")
bearer = HTTPBearer()

def create_token(sub: str):
    payload = {"sub": sub, "iat": int(time.time()), "exp": int(time.time()) + 60*60*12}
    return jwt.encode(payload, SECRET, algorithm="HS256")

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        payload = jwt.decode(creds.credentials, SECRET, algorithms=["HS256"])
        return payload["sub"]
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
