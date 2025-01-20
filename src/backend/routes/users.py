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
    Following, FollowingCreate, UserInDB, User
)
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user
from databaseAndSchemas.mappings.mappings import *


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
def get_all_users_by_id(session: Annotated[Session, Depends(get_session)],
                        user_id: int,
                        current_user: UserInDB = Depends(auth_get_current_user))-> UserInDB:
    """Gets user by id"""
    user = session.get(UserInDB, current_user.id)
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

@users_router.post('/{user_id}/follow', response_model= Following, status_code=201)
def follow_user(session: Annotated[Session, Depends(get_session)],
                user_id: int,
                current_user: UserInDB = Depends(auth_get_current_user))-> Following:
    """Current User Follows a User with User ID"""
    user = session.get(UserInDB, user_id)
    if user:
        currentFollow = len(session.exec(select(FollowingInDB).filter(FollowingInDB.followerID == current_user.id and FollowingInDB.followeeID == user_id)).all())
        if currentFollow < 1:
            following_db = FollowingInDB(
                followerID=current_user.id,
                followeeID=user_id
            )
            session.add(following_db)
            session.commit()
            session.refresh(following_db)

            return map_following_db_to_response(following_db)
        else:
            raise HTTPException(
            status_code=404,
            detail={
                "type":"duplicate_follow",
                "entity_name":"user",
                "entity_id":user_id
            }
        )

    else:
        raise HTTPException(
            status_code=404,
            detail={
                "type":"entity_not_found",
                "entity_name":"user",
                "entity_id":user_id
            }
        )
    
@users_router.get('/{user_id}/following', response_model= list[FollowingInDB], status_code=201)
def get_following(session: Annotated[Session, Depends(get_session)],
                  user_id: int,
                  current_user: UserInDB = Depends(auth_get_current_user))-> list[FollowingInDB]:
    """Get Who Current User is Following"""
    return session.exec(select(FollowingInDB).filter(FollowingInDB.followerID == user_id)).all()
    
@users_router.post('/{user_id}/followers', response_model= list[FollowingInDB], status_code=201)
def get_followers(session: Annotated[Session, Depends(get_session)],
                user_id: int,
                current_user: UserInDB = Depends(auth_get_current_user))-> list[FollowingInDB]:
    """Get Who Follows Current User"""
    return session.exec(select(FollowingInDB).filter(FollowingInDB.followeeID== user_id)).all()