import pytest
from TestUtilites import (
    engine_fixture,
    session_fixture, 
    client_fixture
)
from sqlmodel import Session
from fastapi.testclient import TestClient
from databaseAndSchemas import UserInDB, PostInDB, MediaInDB
from TestUtilites.TestEnvironmentManager import TestEnvManager
from pathlib import Path
from passlib.context import CryptContext
from sqlalchemy import text 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

data = [
        UserInDB(
            firstname="Arthur",
            lastname="Morgan",
            username="ArthurMorgan",
            email="arthur.morgan@vanderlinde.gang",
            bio="I have a plan, I just need time and money",
            hashed_password=pwd_context.hash("Boah1899"),
            isSeller=True
        ), 
]
 

@pytest.fixture(scope="module")
def env_manager(session: Session, client: TestClient):
    """Creates TestEnvManager using existing session and client fixtures"""
    manager = TestEnvManager(session, client, data)
    return manager

def test_media_file_upload(client:TestClient, engine, env_manager:TestEnvManager):

    arthur = data[0]
    request_headers = env_manager.get_auth_headers(arthur.username, "Boah1899")

    env_manager.create_post(arthur.username, "my profile pic")

    current_dir = Path(__file__).parent

    test_image = current_dir / 'assets' / 'arthur.png'

    with open(test_image, 'rb') as image_file:
        image = {
            'file': (test_image.name, image_file, 'image/png')
        }
        response = client.post("/media/upload", headers=request_headers, files=image)

    assert response.status_code == 201 

    with engine.connect() as conn:
        file_upload = conn.execute(text("SELECT * FROM 'media' WHERE postID = 1")).first()

    media_upload = MediaInDB(**file_upload._mapping)

    assert media_upload.url == 'http://localstack:4566/sour-user-images-000000000000-us-west-1/1_20250214_204155_arthur.png'
    assert media_upload.isVideo == False



    print(response)



