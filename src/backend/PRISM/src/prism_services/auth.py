import os
import sys
import json
import boto3
import logging
from passlib.context import CryptContext
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from pydantic import BaseModel, ValidationError
from typing import Annotated
from sqlalchemy.future import select
from sqlmodel import Session, SQLModel, select
from jose import ExpiredSignatureError, JWTError, jwt
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
)
from .test_db import get_session

SessionDep = Annotated[Session, Depends(get_session)]
from .schema import(
    UserInDB, UserResponse, UserRegistration, User, UserLogin
)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from .prism_exceptions import(
    AuthException, 
    InvalidCredentials, 
    DuplicateUserRegistration
) 

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app_auth.log'),
        logging.StreamHandler()
    ]
)

# Create logger instance
logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwt_key = str(os.environ.get("JWT_KEY"))
jwt_alg = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")
auth_router = APIRouter( tags=["Authentication"])
access_token_duration = 3600 

localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')



@auth_router.post("/createuser", response_model=UserResponse, status_code=201)
def create_new_user(newUser: UserRegistration, session: Annotated[Session, Depends(get_session)]) -> UserResponse:
    """Registering a new User"""
    try:
        hashed_pwd = pwd_context.hash(newUser.password)
        if check_username(newUser, session):
            raise DuplicateUserRegistration("User", "username", newUser.username)
        elif check_email(newUser, session):
            raise DuplicateUserRegistration("User", "email", newUser.email)
        else:
            userDB = UserInDB(
                **newUser.model_dump(),
                hashed_password=hashed_pwd
            )
            session.add(userDB)
            session.commit()
            session.refresh(userDB)
            user_data = User(username=userDB.username, email=userDB.email)
            return UserResponse(user=user_data)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@auth_router.post("/login", response_model=UserResponse, status_code=200)
def login_user(user:UserLogin, session: Annotated[Session, Depends(get_session)]):
        """Logging a user in"""
        user_check = session.exec(select(UserInDB).filter(UserInDB.username == user.username)).first()

        if user is None or not pwd_context.verify(user.password, user_check.hashed_password):
            raise InvalidCredentials()
        return UserResponse(user={"username": user.username, "email": user_check.email})

def check_username(newUser, session):
    result = session.exec(select(UserInDB.username).where(UserInDB.username == newUser.username))
    return result.first() is not None
   
def check_email(newUser, session):
    result = session.exec(select(UserInDB.email).where(UserInDB.email == newUser.email))
    return result.first() is not None
