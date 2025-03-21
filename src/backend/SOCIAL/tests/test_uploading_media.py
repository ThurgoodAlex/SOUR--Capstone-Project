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
***REMOVED***
import os
from sqlalchemy import Engine

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

BASE_URL ='http://localhost:4566/sour-user-images-000000000000-us-west-1/'

@pytest.fixture(scope="module")
def env_manager(session: Session, client: TestClient):
    """Creates TestEnvManager using existing session and client fixtures"""
    manager = TestEnvManager(session, client, data)
    return manager

@pytest.fixture()
def media_comparator():
    return MediaComparator()


S3_BUCKET_NAME = f"sour-user-images-{AWS_ACCOUNT_ID}-{AWS_REGION}"


@pytest.fixture(scope="module", name="expected_post_id")
def create_post_fixture(env_manager:TestEnvManager)-> int:
    post_id = env_manager.create_post(TEST_USER_USERNAME, "my profile pic")
    return post_id 


class TestFileUploads: 
    def test_photo_file_upload( 
        self,
        client: TestClient,
        engine: Engine, 
        env_manager: TestEnvManager,
        media_comparator: MediaComparator, 
        expected_post_id: int
        ):

        request_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, "Boah1899")

        current_dir = Path(__file__).parent

        test_image = current_dir / 'assets' / 'arthur.png'

        with open(test_image, 'rb') as image_file:
            
            file = {
                'file': ('arthur.png', image_file, 'image/png')
            }
            form_data = {
                'post_id' : expected_post_id
            }

            response = client.post("/media/upload", headers=request_headers,files=file, data = form_data)

        assert response.status_code == 201 

        response_data = response.json()
        response_data_id = response_data["id"]

        assert response_data["isVideo"] == False

        expected_user = env_manager.get_user(TEST_USER_USERNAME)

        expected_url_regex = ''.join([BASE_URL, f'{expected_user.id}/{expected_post_id}/', 'image/\\d{8}_\\d{6}_arthur\.png'])

        expected_url_pattern = re.compile(expected_url_regex)

        with engine.connect() as conn:
            uploaded_media_row = conn.execute(text(f'SELECT * FROM media WHERE id = {response_data_id}')).first()

        assert re.match(expected_url_pattern, response_data["url"]) is not None
        assert re.match(expected_url_pattern, uploaded_media_row.url) is not None

        s3_image_key= uploaded_media_row.url[len(BASE_URL):]

        s3_image = media_comparator.get_s3_media(S3_BUCKET_NAME, s3_image_key)
        local_image = media_comparator.get_local_media(test_image)

        images_the_same = media_comparator.compare_media(s3_image, local_image)

        assert images_the_same == True

    def test_video_file_upload(
        self,
        client: TestClient,
        engine: Engine,
        env_manager: TestEnvManager,
        media_comparator: MediaComparator,
        expected_post_id: int
        ):

        request_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, TEST_USER_PASSWORD)

        current_dir = Path(__file__).parent

        test_video = current_dir / 'assets' / 'arthur_vid.mp4'

        with open(test_video, 'rb') as video_file:
            
            file = {
                'file': ( "arthur_vid.mp4", video_file, 'video/mp4')
            }
            form_data = {
                'post_id' : expected_post_id
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

        user = env_manager.get_user(TEST_USER_USERNAME)

        expected_user = env_manager.get_user(TEST_USER_USERNAME)

        expected_url_regex = ''.join([BASE_URL, f'{expected_user.id}/{expected_post_id}/', 'video/\\d{8}_\\d{6}_arthur_vid\.mp4'])

        expected_url_pattern = re.compile(expected_url_regex)

        with engine.connect() as conn:
            uploaded_media_row = conn.execute(text(f'SELECT * FROM media WHERE id = {response_data_id}')).first()

        assert re.match(expected_url_pattern, response_data["url"]) is not None
        assert re.match(expected_url_pattern, uploaded_media_row.url) is not None

        s3_image_key= uploaded_media_row.url[len(BASE_URL):]

        s3_image = media_comparator.get_s3_media(S3_BUCKET_NAME, s3_image_key)
        local_image = media_comparator.get_local_media(test_video)

        videos_the_same = media_comparator.compare_media(s3_image, local_image)
        assert videos_the_same == True

    def test_uploading_invalid_media(
        self,
        client: TestClient,
        env_manager: TestEnvManager,
        expected_post_id: int
        ):

        request_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, TEST_USER_PASSWORD)

        current_dir = Path(__file__).parent

        filename = 'dutch.txt'

        test_file = current_dir / 'assets' / filename 

        with open(test_file, 'rb') as text_file:
            
            file = {
                'file': ( filename, text_file, 'text/txt')
            }
            form_data = {
                'post_id' : expected_post_id
            }

            response = client.post(
                "/media/upload",
                headers= request_headers,
                files= file,
                data= form_data
            )

        assert response.status_code == 400 

        data = response.json()

        assert data["detail"] == "Invalid file type: 400: file with MIME type text not accepted"

    def test_uploading_invalid_post_id(
        self,
        client: TestClient,
        env_manager: TestEnvManager,
        ):

        request_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, TEST_USER_PASSWORD)

        current_dir = Path(__file__).parent

        test_image = current_dir / 'assets' / 'arthur.png'

        invalid_post_id = 99813

        with open(test_image, 'rb') as image_file:
            
            file = {
                'file': ('arthur.png', image_file, 'image/png')
            }
            form_data = {
                'post_id' : invalid_post_id
            }

            response = client.post(
                "/media/upload",
                headers= request_headers,
                files= file,
                data= form_data
                )

        assert response.status_code == 404 
        data = response.json()
        assert data["detail"] == "Associated post not found: 400: Cannot find post associated with id: 99813"
        
    def test_uploading_an_empty_file(
        self,
        client: TestClient,
        env_manager: TestEnvManager,
        expected_post_id: int
        ):

        request_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, TEST_USER_PASSWORD)

        current_dir = Path(__file__).parent

        file_name = 'empty.png'

        test_image = current_dir / 'assets' / file_name

        with open(test_image, 'rb') as image_file:
            
            file = {
                'file': (file_name, image_file, 'image/png')
            }
            form_data = {
                'post_id' : expected_post_id 
            }

            response = client.post(
                "/media/upload",
                headers= request_headers,
                files= file,
                data= form_data
                )

        assert response.status_code == 400 
        data = response.json()
        assert data["detail"] == "Uploaded file is empty."
        
