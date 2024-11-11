import sqlite3
import json
import os
import boto3
from datetime import datetime
from sqlmodel import Session, SQLModel, create_engine, select
from fastapi.testclient import TestClient
import sys
sys.path.insert(0, "../../..")  # Adds backend/backend to PYTHONPATH
from app import app

from schema import(
    UserInDB
)

s3 = boto3.client(
    's3',
    endpoint_url="http://localhost:4566",
    region_name="us-east-1",               
    aws_access_key_id="test",              
    aws_secret_access_key="test"
)

def setup_s3_bucket():
    bucket_name = "test-bucket"
    # Create a bucket in LocalStack
    s3.create_bucket(Bucket=bucket_name)


engine = create_engine(
    f"sqlite:///./test_prism.db",
    pool_pre_ping=True,
    echo=True,
    connect_args={"check_same_thread": False},
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


class EntityNotFoundException(Exception):
    def __init__(self, entity_name: str, entity_id: str):
        self.entity_name = entity_name
        self.entity_id = entity_id


class DuplicateEntityException(EntityNotFoundException):
    pass


def get_all_users(session: Session) -> list[UserInDB]:
    """
    Retrieve all users from the database.

    :return: ordered list of users
    """

    return session.exec(select(UserInDB)).all()


#Test create a user
def test_create_new_user():
    setup_s3_bucket()
    client = TestClient(app)
    user_data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "securepassword123"
    }
    
    response = client.post("/createuser",json = user_data)
    
    assert response.status_code == 201
    response_data = response.json()
    print(response_data)
    assert response_data["user"]["username"] == user_data["username"]
    assert response_data["user"]["email"] == user_data["email"]