import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from unittest.mock import patch
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent))

from PRISM import (
    auth_router,
    get_session
)

from databaseAndSchemas import (
    MediaInDB, 
    createMedia,
    Media,
    UserInDB, 
    PostInDB
)

from datetime import datetime, timedelta

__all__ = ['engine', 'session', 'client', 'mock_logging']


@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine("sqlite:///file:memdb?mode=memory&cache=shared&uri=true",
                         connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="session")
def session_fixture(engine):  # Note: added engine dependency
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

@pytest.fixture(name="test_user")
def user_fixture(session: Session):
    user = UserInDB(
        firstname="Test",
        lastname="User",
        username="testuser",
        email="test@example.com",
        hashed_password="testpass",  # In real app, this would be hashed
        isSeller=True
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def 