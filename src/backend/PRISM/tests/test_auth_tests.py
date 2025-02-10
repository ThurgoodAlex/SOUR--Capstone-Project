import pytest
from TestUtilites import (
    engine_fixture, 
    session_fixture, 
    client_fixture
)
from fastapi.testclient import TestClient
from PRISM.prism_exceptions import DuplicateUserRegistration
from databaseAndSchemas.schema import(
    UserInDB 
)
from sqlalchemy import text
from sqlmodel import select
from datetime import datetime, timezone
from jose import jwt
from passlib.context import CryptContext
import logging
from pytest import LogCaptureFixture
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwt_key = str(os.environ.get("JWT_KEY"))
jwt_alg = "HS256"


TEST_USER = {
    "firstname":"John",
    "lastname":"Doe",
    "username":"johndoe",
    "email":"john@doe.com",
    "bio":"A regular user",
    "password":"password123",
    "isSeller":False
}

@pytest.fixture( name="test_user", scope="module")
def test_user(create_test_user, engine):
    with engine.connect() as conn:
        result = conn.execute(text(""" SELECT * FROM users WHERE username = 'johndoe'""")).first()
    return UserInDB(**result._asdict())


@pytest.fixture(scope="module", name= "create_test_user", autouse=True)
def create_test_fixture(session):
    try:
        JOHN = UserInDB(
                    firstname=TEST_USER["firstname"],
                    lastname=TEST_USER["lastname"],
                    username=TEST_USER["username"],
                    email=TEST_USER["email"],
                    bio=TEST_USER["bio"],
                    hashed_password=pwd_context.hash(TEST_USER["password"]),
                    isSeller=TEST_USER["isSeller"]
                )
        session.add(JOHN)
        session.commit()
        yield JOHN
    finally:
        session.rollback()


@pytest.fixture(name="test_token",scope="module")
def token_fixture(client: TestClient, test_user: UserInDB):
   """Get authentication token for test user"""
   response = client.post(
       "/auth/token",
       data={"username": TEST_USER["username"], "password": TEST_USER["password"]}
   )
   return response.json()["access_token"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class TestCreatingAUser:
    VALID_USER = {
            "firstname": "Arthur",
            "lastname": "Morgan",
            "username": "ArthurMorgan",
            "email": "ArthurMorgan@vanderlindegang.org",
            "password": "Welcome123"
        }

    def test_create_user_success(self, client:TestClient, session):
        
        response = client.post("/auth/createuser", 
            json=self.VALID_USER)
        print(f"Endpoint: {response.url}")
        print(f"Response: {response.text}")
        
        assert response.status_code == 201
        data = response.json()

        assert data["email"] == self.VALID_USER["email"]
        assert data["firstname"] == self.VALID_USER["firstname"] 
        assert data["lastname"] == self.VALID_USER["lastname"] 
        assert data["username"] == self.VALID_USER["username"]
        assert "password" not in data

        result = session.exec(select(UserInDB.username).where(UserInDB.username == self.VALID_USER["username"])).first()
        assert result is not None

    def test_create_user_duplicate_username(self, client:TestClient):
        response = client.post("/auth/createuser", json=self.VALID_USER)
        duplicate_data = self.VALID_USER.copy()
        duplicate_data["email"] = "different@example.com"
        response = client.post("/auth/createuser", json=duplicate_data)
        assert response.status_code == 409
        assert f"409: User with username '{self.VALID_USER['username']}' already exists" in response.json()["detail"]

    def test_create_user_duplicate_email(self, client):
        client.post("/auth/createuser", 
                    json=self.VALID_USER)

        duplicate_data = self.VALID_USER.copy()
        duplicate_data["username"] = "differentuser"
        response = client.post("/auth/createuser", json=duplicate_data)
        assert response.status_code == 409
        assert f"409: User with email '{self.VALID_USER['email']}' already exists" in response.json()["detail"]


USER_LOGIN = {
    "username": TEST_USER["username"],
    "password": TEST_USER["password"]
}

class TestingUserLogin:
    def test_login_user_success(self, client):
        response = client.post("/auth/login", json=USER_LOGIN)
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == USER_LOGIN["username"] 
        assert data["email"] == "john@doe.com"

    def test_login_invalid_username(self,client):
        login_data = {
            "user": "doejohn", 
            "password": "gibberish"
        }
        response = client.post("/auth/login", json=login_data)
        data = response.json()
        assert response.status_code == 422
        print(response)

    def test_login_invalid_password(self, client):
        duplicate_data = USER_LOGIN.copy()
        duplicate_data["password"] = "invalid_password"
        response = client.post("/auth/login", json=duplicate_data)
        data = response.json()
        assert response.status_code == 401

class TestTokenAuthentication:
    def test_get_access_token_success(self,client: TestClient):
        response = client.post(
            "/auth/token",
            data=USER_LOGIN,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["expires_in"] > 0

    def test_get_access_token_invalid_credentials(self, client: TestClient ):
        response = client.post(
            "/auth/token",
            data={"username": "wrong", "password": "wrong"}
        )
        assert response.status_code == 401

    def test_token_expiration(self, client: TestClient):
        response = client.post(
            "/auth/token", 
            data=USER_LOGIN
        )
        token = response.json()["access_token"]
        decoded = jwt.decode(token, key=jwt_key, algorithms=[jwt_alg])
        assert decoded["exp"] > datetime.now(timezone.utc).timestamp()
    
    def test_get_current_user(self, client: TestClient, test_token):

        request_headers = {"Authorization": f"Bearer {test_token}"}
        response = client.get(
            "/auth/me", 
            headers=request_headers
        )
        assert response.status_code == 200
