
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import bcrypt
import os

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

from jose import jwt, JWTError
from datetime import datetime, timedelta

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES",60))


engine = create_engine(DATABASE_URL)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SignupRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")



@app.post("/signup")
def signup(data: SignupRequest):
    with engine.connect() as conn:
        # check if user exists
        result = conn.execute(
            text("SELECT id FROM users WHERE username = :username"),
            {"username": data.username}
        ).fetchone()

        if result:
            raise HTTPException(status_code=400, detail="Username already exists")

        hashed_pw = bcrypt.hashpw(
            data.password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        conn.execute(
            text(
                "INSERT INTO users (username, password_hash) VALUES (:username, :password)"
            ),
            {"username": data.username, "password": hashed_pw}
        )

        conn.commit()

    return {"message": "Signup successful"}


@app.post("/login")
def login(data: LoginRequest):
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT password_hash FROM users WHERE username = :username"),
            {"username": data.username}
        ).fetchone()

        if not result:
            raise HTTPException(status_code=400, detail="Invalid credentials")

        stored_hash = result[0].encode("utf-8")

        if not bcrypt.checkpw(data.password.encode("utf-8"), stored_hash):
            raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token({"sub": data.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/")
def root():
    return {"status": "backend running"}

@app.get("/me")
def read_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}
