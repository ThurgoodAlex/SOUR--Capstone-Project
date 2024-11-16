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
from sqlmodel import Session, SQLModel, select
from jose import ExpiredSignatureError, JWTError, jwt
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
)
from .test_db import get_session

SessionDep = Annotated[Session, Depends(get_session)]
from .schema import(
    UserInDB, UserResponse, UserRegistration
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
def create_new_user(newUser: UserRegistration, session: Session) -> UserResponse:
    try:
        # Invoke the create_user_lambda function
        response = lambda_client.invoke(
            FunctionName='create_user_lambda',  # Ensure this name matches the Lambda function in CDK
            InvocationType='RequestResponse',
            Payload=json.dumps(newUser.model_dump())  # Pass the user data as payload if needed
        )

        hashed_pwd = pwd_context.hash(newUser.password)

        if check_username(newUser):
            raise DuplicateUserRegistration("User", "username", newUser.username)
        elif check_email(newUser):
            raise DuplicateUserRegistration("User", "email", newUser.email)
        else:
            logger.info(str(**newUser.model_dump()))
            user = UserInDB(
                **newUser.model_dump(),
                hashed_password=hashed_pwd
            )
            session.add(user)
            session.commit()
            session.refresh()
            return UserResponse(user=user)
    
    except Exception as e:
        return {"error": str(e)}

    
#TODO: find a cleaner way to do this besides UserRegistration
#TODO: use a form instead of UserRegistration 
@auth_router.post("/login", response_model=UserResponse, status_code=200)
def login_user(user:UserRegistration):
        user = select(UserInDB).where(UserInDB.username == user.username).first()

        if user is None or not pwd_context.verify(user.password, user.hashed_password):
            raise InvalidCredentials()
        return user

def check_email(newUser:UserRegistration):
    return select(UserInDB.email).where(UserInDB.email == newUser.email).first() is not None 

def check_username(newUser:UserRegistration):
    return select(UserInDB.username).where(UserInDB.username == newUser.username).first() is not None 
