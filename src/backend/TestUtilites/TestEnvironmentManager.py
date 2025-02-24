from fastapi.testclient import TestClient
from sqlmodel import Session, select
from databaseAndSchemas import UserInDB, PostInDB
from typing import Dict
from sqlalchemy import text 

class TestEnvManager:
    """A utility class that manages the test environment for integration tests.
    
    This class consolidates core testing functionality by handling:
    - Database seeding with test data
    - JWT token generation
    - Authorization header creation
    - Database queries for test entities

    The class is designed to be instantiated once per test module as a test fixture,
    providing a consistent test environment across all tests.

    Args:
        session (Session): SQLModel session for database operations
        client (TestClient): FastAPI TestClient for making HTTP requests
        test_data: an array of SQLModel BaseModels to be added into the test_db
        
    Example:
        @pytest.fixture(scope="module")
        def env_manager(session, client):
            test_data = [
                UserInDB(username="test_user", ...),
                UserInDB(username="another_user", ...)
            ]
            return TestEnvManager(session, client, test_data)

        def test_endpoint(env_manager):
            headers = env_manager.get_auth_headers("test_user", "password")
            user = env_manager.get_user("test_user")
    """

    def __init__(self, session:Session, client:TestClient, test_data:list):
        self.session = session
        self.client = client 
        self._seed_testing_environment(test_data)
        
    def _seed_testing_environment(self, test_data):
        for row in test_data:
            self.session.add(row)
        self.session.commit()

    def _get_token(self, username: str, password: str) -> str:
        user = self.get_user(username) 
        
        if not user:
            raise ValueError(f"User {username} not found in database")

        response = self.client.post(
            "/auth/token",
            data={
                "username": username,
                "password": password
            }
        )
        return response.json()["access_token"]

    def get_auth_headers(self, username: str, password: str) -> Dict[str, str]:
        """Get authorization headers to make a call to a restricted endpoint"""
        token = self._get_token(username, password)
        return {"Authorization": f"Bearer {token}"}

    def get_user(self,username: str)-> UserInDB:
        """Retrieves a user in the DB"""
        return self.session.exec(
                                select(UserInDB).where(UserInDB.username == username)
                                ).first()
    
    def create_post(self, username: str, post_title)-> int:
        """Creates a post in the DB then returns the post ID"""
        user = self.get_user(username)
        user_id = user.id

        post = PostInDB(
           sellerID=user_id, 
           title= post_title, 
        )

        try: 
            self.session.add(post)
            self.session.commit()
            self.session.refresh(post)  # Refresh to get the generated ID
            return post.id
        except:
            return None






