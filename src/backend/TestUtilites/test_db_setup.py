import os
import pytest
from sqlmodel import Session, SQLModel, create_engine, select
from fastapi.testclient import TestClient
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from databaseAndSchemas import * 
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy import text, Engine
from PRISM import (
    auth_router,
    users_router
)
from SOCIAL import (
    chats_router,
    posts_router,
    media_router
)
__all__ = ['engine_fixture', 'session_fixture', 'client_fixture' ]

POSTGRES_URL = os.environ.get("DATABASE_URL", "postgresql://root:password123@db:5432/test-sour-db")

@pytest.fixture(name="engine", scope="module")
def engine_fixture():
    # Create database if it doesn't exist
    if not database_exists(POSTGRES_URL):
        # Connect to default postgres database to create new db
        default_url = POSTGRES_URL.rsplit('/', 1)[0] + '/postgres'
        default_engine = create_engine(default_url, isolation_level="AUTOCOMMIT")
        with default_engine.connect() as conn:
            # Disconnect all users from DB if it exists
            conn.execute(text("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'test-sour-db'"))
            # Create DB
            conn.execute(text("CREATE DATABASE \"test-sour-db\""))
            conn.commit()
        default_engine.dispose()

    engine = create_engine(
        POSTGRES_URL,
        pool_pre_ping=True
    )      
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)
    engine.dispose()

@pytest.fixture(name="session",scope="module")
def session_fixture(engine):  
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client",scope="module")
def client_fixture(engine, session):
    """Creates a TestClient with all API routers for integration testing.
   Returns a client that simulates HTTP requests against the application."""
    app = FastAPI()
    app.include_router(auth_router, prefix="/auth")
    app.include_router(users_router, prefix="/users")
    app.include_router(posts_router, prefix="/posts")
    app.include_router(media_router, prefix="/media")
    app.include_router(chats_router, prefix="/chats")
    def get_test_session():
        return session
    app.dependency_overrides[get_session] = get_test_session

    return TestClient(app)

