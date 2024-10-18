from datetime import datetime
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel
from pydantic import BaseModel

class Metadata(BaseModel):
    count: int 

class UserInDB(SQLModel, table=True): 
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True)
    hashed_password: str
    created_at: Optional[datetime] = Field(default_factory=datetime.now)


class User(BaseModel):
    username: str
    email: str

class UserResponse(BaseModel):
    user: User

class UserRegistration(BaseModel):
    username: str
    email: str
    password: str
