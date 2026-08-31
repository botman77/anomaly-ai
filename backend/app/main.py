
import os
import json

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import router as auth_router
from .database import connect_db, close_db
from .upload import router as upload_router
from .results import router as results_router
from .progress import PROGRESS_FILE


@asynccontextmanager
async def lifespan(app: FastAPI):

    print("Starting database connection...")

    await connect_db()

    print("✅ Connected to Supabase PostgreSQL")

    yield

    await close_db()

    print("❌ Database connection closed")


app = FastAPI(
    title="AnomalyAI API",
    version="1.0.0",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(results_router)


@app.get("/")
async def home():

    return {
        "message": "AnomalyAI Backend Running",
        "database": "Supabase PostgreSQL"
    }


# @app.get("/health")
# async def health():

#     return {
#         "status": "healthy"
#     }
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/dataset/progress")
def get_progress():

    if not os.path.exists(PROGRESS_FILE):

        return {
            "progress": 0,
            "step": "Waiting..."
        }

    with open(PROGRESS_FILE) as f:

        return json.load(f)