import os
import sys
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
from databaseAndSchemas.test_db import get_session
from databaseAndSchemas.schema import(
    UserInDB,
    UserRegistration,
    User, 
    UserLogin, 
    AccessToken, 
    Claims
)
from databaseAndSchemas.mappings.userMapping import *
from .prism_exceptions import(
    AuthException, 
    InvalidCredentials, 
    DuplicateUserRegistration,
    ExpiredToken,
    InvalidToken
) 
SessionDep = Annotated[Session, Depends(get_session)]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwt_key = str(os.environ.get("JWT_KEY"))
jwt_alg = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token/")

auth_router = APIRouter(tags=["Authentication"])
access_token_duration = 3600 

localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')


@auth_router.post("/createuser/", response_model=User, status_code=201)
def create_new_user(new_user: UserRegistration,
                    session: Annotated[Session, Depends(get_session)]) -> User:
    """Registering a new User"""
    try:
        hashed_pwd = pwd_context.hash(new_user.password)
        if check_username(new_user, session):
            raise DuplicateUserRegistration("User", "username", new_user.username)
        elif check_email(new_user, session):
            raise DuplicateUserRegistration("User", "email", new_user.email)
        else:
            user_db = UserInDB(
                firstname=new_user.firstname,
                lastname=new_user.lastname,
                username=new_user.username,
                email=new_user.email,
                hashed_password=hashed_pwd
            )
            print(user_db)
            session.add(user_db)
            session.commit()
            session.refresh(user_db)
        
            return map_user_db_to_response(user_db)
    
    except DuplicateUserRegistration as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


@auth_router.post("/login/", response_model=User, status_code=200)
def login_user(user:UserLogin,
               session: Annotated[Session, Depends(get_session)]):
        """Logging a user in"""
        user_check = session.exec(select(UserInDB).filter(UserInDB.username == user.username)).first()

        if user_check is None or not pwd_context.verify(user.password, user_check.hashed_password):
            raise InvalidCredentials()
        return map_user_db_to_response(user_check)

def check_username(newUser, session):
    result = session.exec(select(UserInDB.username).where(UserInDB.username == newUser.username))
    return result.first() is not None
   
def check_email(newUser, session):
    result = session.exec(select(UserInDB.email).where(UserInDB.email == newUser.email))
    return result.first() is not None

@auth_router.post("/token/", response_model=AccessToken, status_code=200)
def get_access_token(
    token_request: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    """Get access token for user."""
    user = get_authenticated_user(session, token_request)
    expiration = int(datetime.now(timezone.utc).timestamp()) + access_token_duration
    claims = Claims(sub=str(user.id), exp=expiration)
    access_token = jwt.encode(claims.model_dump(), key=jwt_key, algorithm=jwt_alg)
    return AccessToken(
        access_token=access_token,
        token_type="bearer",
        expires_in=access_token_duration,
    )

def auth_get_current_user(token: str = Depends(oauth2_scheme),
                          session: Session = Depends(get_session)) -> UserInDB:
    """Getting the current authenticated user"""
    try:
        user = decode_access_token(token, session)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Not authenticated")

def get_authenticated_user(session: Session,
                           token_request: TokenRequest) -> UserInDB:
    """Authenticating User"""
    print("this is the token request", token_request)
    user = session.exec(
        select(UserInDB).where(UserInDB.username == token_request.username)
    ).first()
    if user is None or not pwd_context.verify(token_request.password, user.hashed_password):
        raise InvalidCredentials()
    return user

def decode_access_token(token: str, session: Session) -> UserInDB:
    """Decoding access token for user"""
    logger.info("Attempting to decode the token.")
    
    # Log the token (be cautious when logging sensitive information in a production environment)
    logger.debug(f"Token received for decoding: {token[:50]}...")  # Log only part of the token for privacy reasons
    
    try:
        # Decode the token using the secret key and algorithm
        logger.info("Decoding the token using the JWT key and algorithm.")
        claims_dict = jwt.decode(token, key=jwt_key, algorithms=[jwt_alg])
        
        claims = Claims(**claims_dict)
        
        user_id = claims.sub
        
        user = session.get(UserInDB, user_id)

        if user is None:
            raise InvalidToken()

        logger.info(f"User with ID {user_id} found in the database.")
        return user
    
    except ExpiredSignatureError:
        logger.error("Token has expired.")
        raise ExpiredToken()
    except JWTError as e:
        logger.error(f"JWT error occurred: {str(e)}")
        raise InvalidToken()
    except ValidationError as e:
        logger.error(f"Validation error occurred while decoding claims: {str(e)}")
        raise InvalidToken()
    except Exception as e:
        logger.error(f"Unexpected error during token decoding: {str(e)}")
        raise InvalidToken()



@auth_router.get("/me/", response_model=User)
def get_current_user(current_user: UserInDB = Depends(auth_get_current_user)):
    """Get current user."""
    return map_user_db_to_response(current_user)