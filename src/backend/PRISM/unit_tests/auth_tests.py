import pytest
from PRISM.unit_tests.auth_tests_env_setup import engine_fixture, session_fixture, client_fixture, mock_logging
from PRISM.prism_exceptions import DuplicateUserRegistration
from PRISM.schema import UserRegistration
@pytest.fixture
def valid_user_data():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123"
    }

# Tests
def test_create_user_success(client,valid_user_data):
    response = client.post("/createuser", 
        json=valid_user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["user"]["username"] == "testuser"
    assert data["user"]["email"] == "test@example.com"

def test_create_user_duplicate_username(client, valid_user_data):
    client.post("/createuser", json=valid_user_data)
    
    # Try duplicate username
    duplicate_data = valid_user_data.copy()
    duplicate_data["email"] = "different@example.com"
    response = client.post("/createuser", json=duplicate_data)
    assert response.status_code == 409
    assert f"409: User with username '{valid_user_data['username']}' already exists" in response.json()["detail"] 

def test_create_user_duplicate_email(client, valid_user_data):
    client.post("/createuser", 
                json=valid_user_data)

    duplicate_data = valid_user_data.copy()
    duplicate_data["username"] = "differentuser"
    response = client.post("/createuser", json=duplicate_data)
    assert response.status_code == 409
    assert f"409: User with email '{valid_user_data['email']}' already exists" in response.json()["detail"] 

