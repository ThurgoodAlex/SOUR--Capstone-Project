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

from .test_db import get_session

SessionDep = Annotated[Session, Depends(get_session)]
from .schema import(
    UserInDB, UserResponse, UserRegistration, User, UserLogin, AccessToken, Claims
)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from .prism_exceptions import(
    AuthException, 
    InvalidCredentials, 
    DuplicateUserRegistration,
    ExpiredToken,
    InvalidToken
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


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

class TokenRequest(BaseModel):
    username: str
    password: str
    grant_type: str = "password"

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
            user_data = User(username=userDB.username, email=userDB.email, id=userDB.id)
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


@auth_router.post("/token", response_model=AccessToken, status_code=200)
def get_access_token(
    token_request: TokenRequest, 
    session: Session = Depends(get_session)
):
    """Get access token for user."""
    
    logger.info("in the /token")
    # Authenticate the user with the provided credentials
    user = get_authenticated_user(session, token_request)
    return build_access_token(user)

# def auth_get_current_user(session = Depends(get_session)) -> UserInDB:
#     """Getting the current authenticated user"""
#     logger.info("getting current user")
#     token = session
#     user = decode_access_token(session, token)
    
#     return user


def auth_get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> UserInDB:
    """Getting the current authenticated user"""
    # Decode the token to get the user data
    user = decode_access_token(token, session)
    
    return user



# old stuff uses formData in URL Parameter encoding: replaced below using JSON (Token Request BaseModel) for consistency
# def get_authenticated_user(session: Session,form: OAuth2PasswordRequestForm,) -> UserInDB:
#     """Authenticating User"""
#     user = session.exec(select(UserInDB).where(UserInDB.username == form.username)).first()
#     if user is None or not pwd_context.verify(form.password, user.hashed_password):
#         raise InvalidCredentials()
#     return user

def get_authenticated_user(session: Session, token_request: TokenRequest) -> UserInDB:
    """Authenticating User"""
    user = session.exec(
        select(UserInDB).where(UserInDB.username == token_request.username)
    ).first()
    if user is None or not pwd_context.verify(token_request.password, user.hashed_password):
        raise InvalidCredentials()
    return user

def build_access_token(user: UserInDB) -> AccessToken:
    """Building access token for user"""
    expiration = int(datetime.now(timezone.utc).timestamp()) + access_token_duration
    claims = Claims(sub=str(user.id), exp=expiration)
    access_token = jwt.encode(claims.model_dump(), key=jwt_key, algorithm=jwt_alg)

    return AccessToken(
        access_token=access_token,
        token_type="Bearer",
        expires_in=access_token_duration,
    )


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



@auth_router.get("/me", response_model=UserResponse)
def get_current_user(current_user: UserInDB = Depends(auth_get_current_user)):
    """Get current user."""
    logger.info("In the /me endpoint")
    # Return user response without including the hashed password
    user_response = User(**current_user.model_dump(exclude={"hashed_password"}))
    return UserResponse(user=user_response)