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
from TestUtilites.TestEnvironmentManager import TestEnvManager
from sqlmodel import Session, select

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwt_key = str(os.environ.get("JWT_KEY"))
jwt_alg = "HS256"


users = [
        UserInDB(
            firstname="Arthur",
            lastname="Morgan",
            username="ArthurMorgan",
            email="arthur.morgan@vanderlinde.gang",
            bio="I have a plan, I just need time and money",
            hashed_password=pwd_context.hash("Boah1899"),
            isSeller=False
        ),
        UserInDB(
            firstname="Dutch", 
            lastname="Van der Linde",
            username="DutchVanDerLinde",
            email="dutch@vanderlinde.gang",
            bio="Just have some faith!",
            hashed_password=pwd_context.hash("Tahiti1899"),
            isSeller=True
        ),
        UserInDB(
            firstname="John",
            lastname="Marston",
            username="JohnMarston", 
            email="john.marston@vanderlinde.gang",
            bio="I'm not the man I was before",
            hashed_password=pwd_context.hash("Abigail1899"),
            isSeller=False
        ),
        UserInDB(
            firstname="Hosea",
            lastname="Matthews",
            username="HoseaMatthews",
            email="hosea@vanderlinde.gang", 
            bio="This is a fine mess we're in",
            hashed_password=pwd_context.hash("Conman1899"),
            isSeller=True
        ),
        UserInDB(
            firstname="Micah",
            lastname="Bell",
            username="MicahBell",
            email="micah.bell@vanderlinde.gang",
            bio="All I see is you, me, a river full of dead O'driscolls, and a lockbox. I'd say we're golden here, Morgan",
            hashed_password=pwd_context.hash("tahiti01"),
            isSeller=True
        )
    ]


@pytest.fixture(scope="module")
def env_manager(session: Session, client: TestClient):
    """Creates TestEnvManager using existing session and client fixtures"""
    manager = TestEnvManager(session, client, users)
    return manager

TEST_USER = {
    "firstname":"Arthur",
    "lastname":"Morgan",
    "username":"ArthurMorgan",
    "email":"arthur.morgan@vanderlinde.gang",
    "bio":"get out of the damn way",
    "password":"Boah1899",
    "isSeller":False
}


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def test_query_all_users(client:TestClient, env_manager:TestEnvManager):
    request_header = env_manager.get_auth_headers(TEST_USER["username"], TEST_USER["password"])
    response = client.get(
        "/users/",
        headers=request_header
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5

class TestGettingUsersByID:

    def test_query_user_by_id(self, client:TestClient, env_manager:TestEnvManager):

        request_header = env_manager.get_auth_headers(TEST_USER["username"], TEST_USER["password"])

        test_user = env_manager.get_user(TEST_USER["username"])

        response = client.get(
            f"/users/{test_user.id}/",
            headers=request_header
        )

        assert response.status_code == 200
        data = response.json()
        assert test_user.firstname == data['firstname']
        assert test_user.lastname == data['lastname']
        assert test_user.username == data['username']
        assert test_user.email == data['email']
        assert test_user.id == data['id']

    def test_query_non_existent_user_by_id(self, client:TestClient, env_manager:TestEnvManager):
        
        request_header = env_manager.get_auth_headers(TEST_USER["username"], TEST_USER["password"])

        INVALID_USER_ID = -999999

        response = client.get(
            f"/users/{INVALID_USER_ID}/",
            headers=request_header
        )

        assert response.status_code == 404 

        data = response.json()

        response_detail = data["detail"]

        assert response_detail == f"user with id:{INVALID_USER_ID} not found"

    def test_querying_deleted_user(self, client:TestClient, engine, env_manager:TestEnvManager):

        request_header = env_manager.get_auth_headers('MicahBell', "tahiti01")

        deleted_user = None
        with engine.connect() as conn: 
            deleted_user = conn.execute(text("SELECT id FROM users WHERE username = 'MicahBell'")).first()
            conn.execute(text("DELETE FROM users WHERE username = 'MicahBell'"))
            conn.commit()

        response = client.get(f"/users/{deleted_user.id}/", 
                              headers=request_header)

        assert response.status_code == 404

        data = response.json()

        response_detail = data["detail"]

        assert response_detail == f"user with id:{deleted_user.id} not found"

class TestBecomingASeller:

    def test_becoming_a_seller(self, client:TestClient, engine, env_manager:TestEnvManager):        

            request_header = env_manager.get_auth_headers(TEST_USER["username"], TEST_USER["password"])

            test_user = env_manager.get_user(TEST_USER["username"])        

            with engine.connect() as conn:
                user = conn.execute(text('SELECT * FROM users WHERE id = :id'), {"id": test_user.id}).first()
            assert user.isSeller == False

            response = client.put("/users/becomeseller", headers=request_header)

            with engine.connect() as conn:
                user = conn.execute(text('SELECT * FROM users WHERE id = :id'), {"id": test_user.id}).first()

            assert user.isSeller == True 

            assert response.status_code == 200

            data = response.json()

            user = UserInDB(**user._mapping)

            assert data["username"]== user.username 
            assert data["firstname"] == user.firstname
            assert data["lastname"] == user.lastname 
            assert data["id"] == user.id 
            assert data["isSeller"] == True

    
    def test_seller_tries_to_become_seller_again(self,client:TestClient, engine, env_manager:TestEnvManager):

            request_header = env_manager.get_auth_headers("DutchVanDerLinde", "Tahiti1899")

            with engine.connect() as conn:
                user = conn.execute(text('SELECT * FROM users WHERE username = :username'), {"username": "DutchVanDerLinde"}).first()

            assert user.isSeller == True

            response = client.put("/users/becomeseller", headers=request_header)

            with engine.connect() as conn:
                user = conn.execute(text('SELECT * FROM users WHERE username = :username'), {"username": "DutchVanDerLinde"}).first()

            assert user.isSeller == True 

            assert response.status_code == 200

            data = response.json()

            user = UserInDB(**user._mapping)

            assert data["username"]== user.username 
            assert data["firstname"] == user.firstname
            assert data["lastname"] == user.lastname 
            assert data["id"] == user.id 
            assert data["isSeller"] == True

    @pytest.mark.skip(reason="Feature not implemented: Need to add exception when this happens")
    def test_deleted_user_tries_to_become_seller(self):
        pass
    

class TestUnregisteringAsSeller:

    def test_seller_unregisters(self, env_manager, client:TestClient): 
        request_headers = env_manager.get_auth_headers("DutchVanDerLinde", "Tahiti1899")
        response = client.put("/users/unregisterseller", headers=request_headers)
        response.status_code == 200

    def test_non_seller_unregisters(self):
        pass 

    def test_deleted_user_unregisters(self):
        pass 

class TestUnregisteringAsSeller:

    def test_seller_unregisters(self, env_manager:TestEnvManager, client:TestClient): 
        request_headers = env_manager.get_auth_headers("DutchVanDerLinde", "Tahiti1899")
        response = client.put("/users/unregisterseller", headers=request_headers)

        assert response.status_code == 200

        user = env_manager.get_user("DutchVanDerLinde")

        expected = UserInDB(
                            firstname="Dutch", 
                            lastname="Van der Linde",
                            username="DutchVanDerLinde",
                            email="dutch@vanderlinde.gang",
                            bio="Just have some faith!",
                            hashed_password=pwd_context.hash("Tahiti1899"),
                            isSeller=False
                            ) 

        assert user.model_dump(exclude=["created_at", "id"]) == expected.model_dump()

    @pytest.mark.skip(reason="edge case not considered, error code has not been implemented")
    def test_non_seller_unregisters(self, client:TestClient, env_manager:TestEnvManager):

        request_headers = env_manager.get_auth_headers("JohnMarston","Abigail1899")

        response = client.put("/users/unregisterseller", headers=request_headers)

        assert response == 409


    @pytest.mark.skip(reason="edge case not considered, error code has not been implemented")
    def test_deleted_user_unregisters(self):
        pass 

class TestFollow:
    def test_following_another_user(self, client:TestClient, env_manager:TestEnvManager, engine):

        CURRENT_USER = UserInDB(
            firstname="John",
            lastname="Marston",
            username="JohnMarston", 
            email="john.marston@vanderlinde.gang",
            bio="I'm not the man I was before",
            hashed_password=pwd_context.hash("Abigail1899"),
            isSeller=False
        ) 

        FOLLOWEE = UserInDB(
            firstname="Arthur",
            lastname="Morgan",
            username="ArthurMorgan",
            email="arthur.morgan@vanderlinde.gang",
            bio="I have a plan, I just need time and money",
            hashed_password=pwd_context.hash("Boah1899"),
            isSeller=False
        ) 

        current_user_auth_headers = env_manager.get_auth_headers(CURRENT_USER.username, "Abigail1899")

        follower_in_db = env_manager.get_user(CURRENT_USER.username)
        followee_in_db = env_manager.get_user(FOLLOWEE.username)

        response = client.post(f"/users/{followee_in_db.id}/follow/", headers=current_user_auth_headers)

        assert response.status_code == 201

        data = response.json()

        assert data["followerID"] == follower_in_db.id
        assert data["followeeID"] == followee_in_db.id

        with engine.connect() as conn:
            followee_follower_db_row = conn.execute(text(f"SELECT * FROM FollowingAndFollowees WHERE id = {data['id']}")).first()
        assert followee_follower_db_row is not None
        assert followee_follower_db_row.id == data["id"]
        assert followee_follower_db_row.followerID == data["followerID"]
        assert followee_follower_db_row.followeeID == data["followeeID"]


        

