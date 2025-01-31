import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from unittest.mock import patch
from PRISM.auth import auth_router, get_session
from databaseAndSchemas import (
    MediaInDB, 
    createMedia,
    Media,
    UserInDB, 
    PostInDB
)

from datetime import datetime, timedelta
from jose import jwt 
from sqlmodel.pool import StaticPool
import os
import app

__all__ = ['engine', 'session', 'client', 'mock_logging']

SECRET_KEY = str(os.environ.get("JWT_KEY"))  # Use your actual secret key
ALGORITHM = "HS256"

@pytest.fixture(name="mock_logging", autouse=True)
def mock_logging():
    with patch('logging.FileHandler'):
        yield

@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    return engine

@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture(name="test_user")
def test_user_fixture(session: Session):
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

@pytest.fixture(name="test_token")
def test_token_fixture(test_user):
    # Create a test JWT token
    exp = datetime.utcnow() + timedelta(minutes=30)
    data = {"sub": str(test_user.id), "exp": exp}
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token

@pytest.fixture(name="authorized_client")
def authorized_client_fixture(client: TestClient, test_token: str):
    client.headers = {
        "Authorization": f"Bearer {test_token}",
        **client.headers
    }
    return client

@pytest.fixture(name="test_post")
def test_post_fixture(session: Session, test_user):
    post = PostInDB(
        sellerID=test_user.id,
        title="Test Post",
        description="Test description",
        isListing=False
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

@pytest.fixture(name="test_media")
def test_media_fixture(session: Session, test_post):
    media = MediaInDB(
        url="http://test.com/image.jpg",
        isVideo=False,
        postID=test_post.id
    )
    session.add(media)
    session.commit()
    session.refresh(media)
    return media

# Now the actual tests
def test_get_all_media(authorized_client: TestClient, test_media: MediaInDB):
    response = authorized_client.get("/media/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["url"] == test_media.url
    assert data[0]["postID"] == test_media.postID

def test_get_media_by_id(authorized_client: TestClient, test_media: MediaInDB):
    response = authorized_client.get(f"/media/{test_media.id}/")
    assert response.status_code == 200
    data = response.json()
    assert data["url"] == test_media.url
    assert data["postID"] == test_media.postID

def test_get_nonexistent_media(authorized_client: TestClient):
    response = authorized_client.get("/media/99999/")
    assert response.status_code == 404  # Assuming you're returning 404 for not found

def test_delete_media_owner(authorized_client: TestClient, test_media: MediaInDB):
    response = authorized_client.delete(f"/media/{test_media.id}/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Media deleted successfully."

def test_delete_media_not_owner(authorized_client: TestClient, session: Session, test_media: MediaInDB):
    # Create another user
    other_user = UserInDB(
        firstname="Other",
        lastname="User",
        username="otheruser",
        email="other@example.com",
        hashed_password="testpass",
        isSeller=True
    )
    session.add(other_user)
    session.commit()
    
    # Create token for other user
    exp = datetime.utcnow() + timedelta(minutes=30)
    data = {"sub": str(other_user.id), "exp": exp}
    other_token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    
    # Try to delete with other user's token
    headers = {"Authorization": f"Bearer {other_token}"}
    response = authorized_client.delete(f"/media/{test_media.id}/", headers=headers)
    assert response.status_code == 403  # Permission denied
