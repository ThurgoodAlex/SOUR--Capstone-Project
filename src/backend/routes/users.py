from sqlalchemy import or_
import os
import sys
from exceptions import DuplicateResource, EntityNotFound, PermissionDenied
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

    Chat, ChatCreate, ChatInDB, Following, FollowingCreate, UserInDB, User

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



# ------------------------ users -------------------------- #

@users_router.get('/', response_model= list[UserInDB], status_code=201)
def get_all_users(session :Annotated[Session, Depends(get_session)])-> list[UserInDB]:
    """Gets all users"""
    return session.exec(select(UserInDB)).all()

@users_router.get('/{user_id}', response_model= UserInDB, status_code=201)
def get_user_by_id(session: Annotated[Session, Depends(get_session)],
                        user_id: int,
                        current_user: UserInDB = Depends(auth_get_current_user))-> UserInDB:
    """Gets user by id"""
    user = session.get(UserInDB, user_id)
    if user:
        return user
    else:
        raise EntityNotFound("user", user_id)



# ------------------------ followings -------------------------- #

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
            raise DuplicateResource('following', 'users', str(user_id) + ' and ' + str(current_user.id))
    else:
        raise EntityNotFound('user', user_id)
    
@users_router.get('/{user_id}/following', response_model= list[FollowingInDB], status_code=201)
def get_following(session: Annotated[Session, Depends(get_session)],
                  user_id: int,
                  current_user: UserInDB = Depends(auth_get_current_user))-> list[FollowingInDB]:
    """Get Who User is Following"""
    user = session.get(UserInDB, user_id)
    if user:
        return session.exec(select(FollowingInDB).filter(FollowingInDB.followerID == user_id)).all()
    else:
        raise EntityNotFound('user', user_id)
    
@users_router.post('/{user_id}/followers', response_model= list[FollowingInDB], status_code=201)
def get_followers(session: Annotated[Session, Depends(get_session)],
                user_id: int,
                current_user: UserInDB = Depends(auth_get_current_user))-> list[FollowingInDB]:
    """Get Who Follows User"""
    user = session.get(UserInDB, user_id)
    if user:
        return session.exec(select(FollowingInDB).filter(FollowingInDB.followeeID== user_id)).all()
    else:
        raise EntityNotFound('user', user_id)



# ------------------------ chats -------------------------- #

@users_router.get('/{user_id}/chats', response_model=list[Chat], status_code = 201)
def get_all_chats(user_id: int,  
                  session : Annotated[Session, Depends(get_session)],
                  currentUser: UserInDB = Depends(auth_get_current_user)
                  ) -> list[Chat]:
    """Getting all chats for this user"""
    
    # check that user with id exists
    user = session.get(UserInDB, user_id)
    if not user:
        raise EntityNotFound("user", user_id)
    
    # Authenticate that the currently logged-in user matches the URL parameter
    if currentUser.id != user_id:
        raise PermissionDenied("view", "chats")
    
    # Filter chats where the user is either the sender or the recipient
    chats_db = session.exec(
        select(ChatInDB).where(
            or_(
                ChatInDB.senderID == user_id,
                ChatInDB.recipientID == user_id
            )
        )
    ).all()
    #TODO: update schema to order by last_updated
    
    return [Chat(**chat_db.model_dump()) for chat_db in chats_db]

    

            
