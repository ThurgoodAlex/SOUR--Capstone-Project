import pytest
from TestUtilites import (
    engine_fixture,
    session_fixture, 
    client_fixture
)
from sqlalchemy import text
from databaseAndSchemas import (
    UserInDB,
    User
)
from fastapi.testclient import TestClient
from passlib.context import CryptContext
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


@pytest.fixture(name="test_token", scope="module")
def token_fixture(client: TestClient, test_user: UserInDB):
   """Get authentication token for test user"""
   response = client.post(
       "/auth/token",
       data={
            "username": TEST_USER["username"],
            "password": TEST_USER["password"] 
            }
   )
   return response.json()["access_token"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@pytest.fixture(scope="module")
def create_test_user( session):
    JOHN = UserInDB(
                firstname="John",
                lastname="Doe",
                username="johndoe",
                email="john@example.com",
                bio="A regular user",
                hashed_password=pwd_context.hash("password123"),
                isSeller=False
            )
    session.add(JOHN)
    session.commit()

@pytest.fixture( name="test_user", scope="module")
def test_user(create_test_user, engine):
    with engine.connect() as conn:
        result = conn.execute(text(""" SELECT * FROM users WHERE username = 'johndoe'""")).first()
    return UserInDB(**result._asdict())

def test_query_user_by_id(test_user:UserInDB, client:TestClient, test_token):
    request_headers = {"Authorization": f"Bearer {test_token}"}
    response = client.get(
        f"/users/{test_user.id}/",
        headers=request_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert test_user.firstname == data['firstname']
    assert test_user.lastname == data['lastname']
    assert test_user.username == data['username']
    assert test_user.email == data['email']
    assert test_user.id == data['id']






    


