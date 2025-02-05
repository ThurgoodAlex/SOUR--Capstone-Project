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
from PRISM import auth_router

__all__ = ['engine_fixture', 'session_fixture', 'client_fixture' ]

POSTGRES_URL = os.environ.get("DATABASE_URL", "postgresql://root:password123@db:5432/test-sour-db")

@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        POSTGRES_URL,
        pool_pre_ping=True,
        echo=True,
    )      
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="session")
def session_fixture(engine):  
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(engine, session):
    app = FastAPI()
    app.include_router(auth_router)
    def get_test_session():
        return session
    app.dependency_overrides[get_session] = get_test_session
    return TestClient(app)