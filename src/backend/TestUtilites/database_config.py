
from sqlmodel import create_engine
from databaseAndSchemas import *
import os

POSTGRES_URL = os.environ.get("DATABASE_URL", "postgresql://root:password123@db:5432/sour-db")
engine = create_engine(
    POSTGRES_URL,
    pool_pre_ping=True,
    echo=True,
)