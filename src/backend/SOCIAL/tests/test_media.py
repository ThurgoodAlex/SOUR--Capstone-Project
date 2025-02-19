from typing import Dict
import pytest
from TestUtilites import (
    engine_fixture,
    session_fixture, 
    client_fixture,
    TestEnvManager, 
    MediaComparator
)
from sqlmodel import Session
from fastapi.testclient import TestClient
from databaseAndSchemas import UserInDB, PostInDB, MediaInDB
from TestUtilites.TestEnvironmentManager import TestEnvManager
from pathlib import Path
from passlib.context import CryptContext
from sqlalchemy import text 
import python_multipart
***REMOVED***
import os
from sqlalchemy import Engine
import boto3


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

TEST_USER_USERNAME = "ArthurMorgan"
TEST_USER_PASSWORD = "Boah1899"
 
AWS_REGION = os.environ.get('CDK_DEFAULT_REGION', 'us-west-1')
AWS_ACCOUNT_ID = os.environ.get('CDK_DEFAULT_ACCOUNT', '000000000000')

@pytest.fixture(scope="module")
def env_manager(session: Session, client: TestClient):
    """Creates TestEnvManager using existing session and client fixtures"""
    manager = TestEnvManager(session, client, data)
    return manager

@pytest.fixture()
def media_comparator():
    return MediaComparator()


S3_BUCKET_NAME = f"sour-user-images-{AWS_ACCOUNT_ID}-{AWS_REGION}"


@pytest.fixture(scope="module")
def create_post_fixture(env_manager:TestEnvManager)-> int:
    post_id = env_manager.create_post(TEST_USER_USERNAME, "my profile pic")
    return post_id 

    
def test_photo_file_upload( 
    client: TestClient,
    engine: Engine, 
    env_manager: TestEnvManager,
    media_comparator: MediaComparator, 
    create_post_fixture: int
    ):

    request_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, "Boah1899")

    current_dir = Path(__file__).parent

    test_image = current_dir / 'assets' / 'arthur.png'

    with open(test_image, 'rb') as image_file:
        
        file = {
            'file': ('arthur.png', image_file, 'image/png')
        }
        form_data = {
            'post_id' : create_post_fixture
        }

        response = client.post("/media/upload", headers=request_headers,files=file, data = form_data)

    assert response.status_code == 201 

    response_data = response.json()

    response_data_id = response_data["id"]

    with engine.connect() as conn:
        file_upload = conn.execute(text(f'SELECT * FROM media WHERE id = {response_data_id}')).first()

    assert response_data["isVideo"] == False
    
    url_regex_pattern = r'http://localhost:4566/sour-user-images-000000000000-us-west-1/1_\d{8}_\d{6}_arthur\.png'

    assert re.match(url_regex_pattern, response_data["url"]) is not None
    assert re.match(url_regex_pattern, file_upload.url) is not None

    s3_image_key= file_upload.url.split("/")[-1]

    s3_image = media_comparator.get_s3_media(S3_BUCKET_NAME, s3_image_key)
    local_image = media_comparator.get_local_media(test_image)

    images_the_same = media_comparator.compare_media(s3_image, local_image)

    assert images_the_same == True

def test_video_file_upload(
    client: TestClient,
    engine: Engine,
    env_manager: TestEnvManager,
    media_comparator: MediaComparator,
    create_post_fixture: int 
    ):

    request_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, TEST_USER_PASSWORD)

    current_dir = Path(__file__).parent

    test_video = current_dir / 'assets' / 'arthur_vid.mp4'

    with open(test_video, 'rb') as video_file:
        
        file = {
            'file': ( "arthur_vid.mp4", video_file, 'video/mp4')
        }
        form_data = {
            'post_id' : create_post_fixture
        }

        response = client.post(
            "/media/upload",
            headers= request_headers,
            files= file,
            data= form_data
        )

    assert response.status_code == 201 

    response_data = response.json()

    response_data_id = response_data["id"]

    with engine.connect() as conn:
        file_upload = conn.execute(text(f'SELECT * FROM media WHERE id = {response_data_id}')).first()

    assert response_data["isVideo"] == True
    
    url_regex_pattern = r'http://localhost:4566/sour-user-images-000000000000-us-west-1/1_\d{8}_\d{6}_arthur_vid\.mp4'

    assert re.match(url_regex_pattern, response_data["url"]) is not None
    assert re.match(url_regex_pattern, file_upload.url) is not None

    s3_image_key= file_upload.url.split("/")[-1]
    s3_image = media_comparator.get_s3_media(S3_BUCKET_NAME, s3_image_key)

    local_video = media_comparator.get_local_media(test_video)
    videos_the_same = media_comparator.compare_media(s3_image, local_video)

    assert videos_the_same == True

@pytest.mark.skip(reason="Exceptions for invalid file types not implemented")
def test_uploading_invalid_media():
    pass

@pytest.mark.skip(reason="Exception for invalid post id not implemented")
def test_uploading_invalid_post_id():
    pass

@pytest.mark.skip(reason="Exception for an empty file not implemented")
def test_uploading_an_empty_file():
    pass




