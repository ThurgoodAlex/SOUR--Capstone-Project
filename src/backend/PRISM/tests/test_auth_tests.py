import pytest
from PRISM.tests.auth_tests_env_setup import engine_fixture, session_fixture, client_fixture, mock_logging
from PRISM.prism_exceptions import DuplicateUserRegistration
from databaseAndSchemas.schema import(
    UserInDB 
)
from sqlmodel import select


@pytest.fixture
def valid_user_data():
    return {
        "firstname": "john",
        "lastname": "doe",
        "username": "doejohn",
        "email": "john@doe.com",
        "password": "Welcome123"
    }


@pytest.mark.auth
def test_create_user_success(client, session, valid_user_data):
    response = client.post("/createuser", 
        json=valid_user_data)
    assert response.status_code == 201
    data = response.json()

    assert data["email"] == "john@doe.com"
    assert data["firstname"] == "john"
    assert data["lastname"] == "doe"
    assert data["username"] == "doejohn"
    assert "password" not in data

    result = session.exec(select(UserInDB.username).where(UserInDB.username == valid_user_data["username"])).first()
    assert result is not None


@pytest.mark.auth
def test_create_user_duplicate_username(client, valid_user_data):
    client.post("/createuser", json=valid_user_data)
    
    duplicate_data = valid_user_data.copy()
    duplicate_data["email"] = "different@example.com"
    response = client.post("/createuser", json=duplicate_data)
    assert response.status_code == 409
    assert f"409: User with username '{valid_user_data['username']}' already exists" in response.json()["detail"] 

@pytest.mark.auth
def test_create_user_duplicate_email(client, valid_user_data):
    client.post("/createuser", 
                json=valid_user_data)

    duplicate_data = valid_user_data.copy()
    duplicate_data["username"] = "differentuser"
    response = client.post("/createuser", json=duplicate_data)
    assert response.status_code == 409
    assert f"409: User with email '{valid_user_data['email']}' already exists" in response.json()["detail"] 

@pytest.fixture
def user_login():
    return {
        "username": "doejohn",
        "password": "Welcome123"
    }
    
@pytest.mark.auth
def test_login_user_success(client, valid_user_data, user_login):
    client.post("/createuser", 
                json=valid_user_data)

    response = client.post("/login", json=user_login)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "doejohn"
    assert data["email"] == "john@doe.com"

@pytest.mark.auth
def test_login_invalid_username(client, valid_user_data, user_login):
    client.post("/createuser", 
                json=valid_user_data)
    login_data = {
        "user": "doejohn", 
        "password": "gibberish"
    }
    response = client.post("/login", json=login_data)
    data = response.json()
    assert response.status_code == 422
    print(response)

 
@pytest.mark.auth
def test_login_invalid_password(client, valid_user_data, user_login):
    client.post("/createuser", 
                json=valid_user_data)

    duplicate_data = user_login.copy()
    duplicate_data["password"] = "invalid_password"
    response = client.post("/login", json=duplicate_data)
    data = response.json()
    assert response.status_code == 401

def test_auth
