from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel  # Using only SQLModel for table and validation
from pydantic import BaseModel
from typing import ClassVar

class Metadata(BaseModel):
    count: int 


class UserInDB(SQLModel, table=True): 
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}  

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

class UserLogin(BaseModel):
    username: str
    password: str

class ItemListing(BaseModel):
    Title:str
    Description:str 
    Price:float 
    SellerId:int

class ItemListingResponse(BaseModel):
    id: int
    message: str = "Item successfully created" 
    data: ItemListing

class ErrorResponse(BaseModel):
    error: str
    details: str
    code: str