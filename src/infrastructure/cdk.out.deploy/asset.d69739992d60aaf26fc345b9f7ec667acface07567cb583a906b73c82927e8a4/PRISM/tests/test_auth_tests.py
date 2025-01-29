import pytest
from PRISM.tests.auth_tests_env_setup import engine_fixture, session_fixture, client_fixture, mock_logging
from PRISM.prism_exceptions import DuplicateUserRegistration
from databaseAndSchemas.schema import UserRegistration
@pytest.fixture
def valid_user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }


@pytest.mark.auth
def test_create_user_success(client,valid_user_data):
    response = client.post("/createuser", 
        json=valid_user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["username"] == "testuser"
    assert data["user"]["email"] == "test@example.com"

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
        "username": "testuser",
        "password": "testpass123"
    }
    
@pytest.mark.auth
def test_login_user_success(client, valid_user_data, user_login):
    client.post("/createuser", 
                json=valid_user_data)

    response = client.post("/login", json=user_login)
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["username"] == "testuser"
    assert data["user"]["email"] == "test@example.com"

@pytest.mark.auth
def test_login_invalid_username(client, valid_user_data, user_login):
    client.post("/createuser", 
                json=valid_user_data)

    duplicate_data = user_login.copy()
    duplicate_data["username"] = "invaliduser"
    response = client.post("/login", json=duplicate_data)
    data = response.json()
    assert response.status_code == 401
    assert data['detail']['error'] == "Invalid_login"
    assert data['detail']['error_description'] == "Username or password is incorrect"

 
@pytest.mark.auth
def test_login_invalid_password(client, valid_user_data, user_login):
    client.post("/createuser", 
                json=valid_user_data)

    duplicate_data = user_login.copy()
    duplicate_data["password"] = "invalid_password"
    response = client.post("/login", json=duplicate_data)
    data = response.json()
    assert response.status_code == 401
    assert data['detail']['error'] == "Invalid_login"
    assert data['detail']['error_description'] == "Username or password is incorrect"