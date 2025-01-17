import os
import sys
import boto3
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from pydantic import BaseModel, ValidationError
from typing import Annotated
import logging
from sqlalchemy.future import select
from jose import JWTError, jwt
from sqlmodel import Session, SQLModel, select
from databaseAndSchemas.schema import (
    UserInDB, User
)
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user


SessionDep = Annotated[Session, Depends(get_session)]
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/users.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')

users_router = APIRouter(tags=["Users"])

@users_router.get('/', response_model= list[UserInDB], status_code=201)
def get_all_users(session :Annotated[Session, Depends(get_session)])-> list[UserInDB]:
    """Gets all users"""
    return session.exec(select(UserInDB)).all()

@users_router.get('/{user_id}', response_model= UserInDB, status_code=201)
def get_all_users_by_id(session :Annotated[Session, Depends(get_session)], user_id: int)-> UserInDB:
    """Gets user by id"""
    user = session.get(UserInDB, user_id)
    if user:
        return user
    else:
        raise HTTPException(
                status_code=404,
                detail={
                    "type":"entity_not_found",
                    "entity_name":"user",
                    "entity_id":user_id
                }
            )
