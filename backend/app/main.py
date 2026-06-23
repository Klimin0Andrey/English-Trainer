from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.users import router as users_router
from app.api.words import router as words_router
from app.api.auth import router as auth_router
from app.api.review import router as review_router 
from app.api.quiz import router as quiz_router
from sqlalchemy import text

from app.db.database import engine

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(words_router)
app.include_router(auth_router)
app.include_router(review_router)
app.include_router(quiz_router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/db-health")
def db_health():
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT 1")
        )

        return {
            "status": "ok",
            "db_result": result.scalar()
        }