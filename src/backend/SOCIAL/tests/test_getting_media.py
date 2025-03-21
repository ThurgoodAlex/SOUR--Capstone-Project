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

def upload_image(
    client:TestClient, 
    env_manager:TestEnvManager,
    post_id: int, 
    file_name:str
    )-> bool:
    
    current_dir = Path(__file__).parent

    test_file = current_dir / 'assets' / file_name 

    with open(test_file, 'rb') as text_file:
        
        file = {
            'file': ( file_name, text_file, 'image/jpeg')
        }
        form_data = {
            'post_id': post_id 
        }
        response = client.post(
            "/media/upload",
            headers= env_manager.get_auth_headers(TEST_USER_USERNAME, "Boah1899"),
            files= file,
            data= form_data
        )

    return response.status_code == 201


TEST_FILE_NAMES = ["horse_image1.jpg", "horse_image2.jpg"]

@pytest.fixture(name="test_images", scope="class")
def uploaded_test_images_fixture(
    client:TestClient, 
    expected_post_id,
    env_manager: TestEnvManager
    ):

    
    for test_file_name in TEST_FILE_NAMES:
        upload_image(
            client,
            env_manager,
            expected_post_id, 
            test_file_name
        )
        
@pytest.fixture(scope="function", name="post_with_no_media_id")
def create_post_with_no_media_fixture(env_manager:TestEnvManager, expected_post_id)-> int:
    post_id = env_manager.create_post(TEST_USER_USERNAME, "GET OUT of the DAMN WAY!")
    return post_id

class TestGettingPostByID:
    def test_getting_post_by_id(
        self,
        client: TestClient, 
        env_manager: TestEnvManager, 
        test_images,
        expected_post_id,
        media_comparator: MediaComparator
        ):
        
        auth_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, TEST_USER_PASSWORD)
        
        response = client.get(
            f"/media/{expected_post_id}/",
            headers= auth_headers
        )
        
        data = response.json()

        assert data["post_id"] == expected_post_id

        for index, image_data in enumerate(data["items"]):

            current_dir = Path(__file__).parent
            test_image = current_dir / 'assets' / TEST_FILE_NAMES[index]
            local_image = media_comparator.get_local_media(test_image)
            
            s3_image_key= image_data["url"][len(BASE_URL):]
            s3_image = media_comparator.get_s3_media(S3_BUCKET_NAME, s3_image_key)
            
            assert media_comparator.compare_media(s3_image, local_image) == True

    def test_getting_post_by_invalid_id(
        self,
        client: TestClient, 
        env_manager: TestEnvManager, 
        ):

        auth_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, TEST_USER_PASSWORD) 
        
        invalid_post_id = -202
        
        response = client.get(f"/media/{invalid_post_id}/", headers= auth_headers)
        response = response.json()
        
        expected_detail = f"Cannot find post associated with id: {invalid_post_id}"

        assert response["detail"] == expected_detail
    
    def test_getting_post_no_uploaded_media(
        self,
        client:TestClient,
        env_manager:TestEnvManager,
        post_with_no_media_id
        ):

        auth_headers = env_manager.get_auth_headers(TEST_USER_USERNAME, TEST_USER_PASSWORD) 
        
        response = client.get(f"/media/{post_with_no_media_id}", headers= auth_headers)
        assert response.status_code == 200
        
        response = response.json()
        assert response["post_id"] == post_with_no_media_id
        assert len(response["items"]) == 0
    


