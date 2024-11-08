import os
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


from backend.schema import(
    UserInDB, UserResponse, UserRegistration
)
from backend.prism_exceptions import *

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwt_key = str(os.environ.get("JWT_KEY"))
jwt_alg = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")
auth_router = APIRouter(prefix="/auth", tags=["Authentication"])
access_token_duration = 3600 

@auth_router.post("/createuser", response_model=UserResponse, status_code=201)
def create_new_user(newUser: UserRegistration)-> UserResponse:
    
    hashed_pwd = pwd_context.hash(newUser.password)

    if check_username(newUser):
        raise DuplicateUserRegistration("User", "username", newUser.username)
    elif check_email(newUser):
        raise DuplicateUserRegistration("User", "email", newUser.email)
    else: 
        user = UserInDB(
                **newUser.model_dump(), 
                hashed_password = hashed_pwd
                )

        return UserResponse(user = user)
    
#TODO: find a cleaner way to do this besides UserRegistration
#TODO: use a form instead of UserRegistration 
@auth_router.post("/login", response_model=UserResponse, status_code=200)
def login_user(user:UserRegistration):
        user = select(UserInDB).where(UserInDB.username == user.username).first()

        if user is None or not pwd_context.verify(user.password, user.hashed_password):
            raise InvalidCredential()
        return user

def check_email(newUser):
    return select(UserInDB.email).where(UserInDB.email == newUser.email).first() is not None 

def check_username(newUser):
    return select(UserInDB.username).where(UserInDB.username == newUser.username).first() is not None 



