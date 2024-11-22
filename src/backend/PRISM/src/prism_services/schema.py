from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from pydantic import BaseModel
from sqlalchemy.types import Text, DECIMAL
from decimal import Decimal


class Metadata(BaseModel):
    count: int 

#USer DB table

class UserInDB(SQLModel, table=True): 
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}  

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True)
    hashed_password: str
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    listings: list["ListingInDB"] = Relationship(back_populates="seller_user")




#All schemas for users

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


#All schemas for listings

#I know these are basically the same... but for clarity sakes it might be nice to seperate them.

#frontend sends this
class createListing(BaseModel):
    title: str
    description: str
    price: Decimal

#backend sends this
class Listing(BaseModel):
    title: str
    description: str
    price: Decimal

#cleaner way to hold a Listing
class ListingResponse(BaseModel):
    Listing: Listing

class ListingList(BaseModel):
    meta: Metadata
    listings: list[Listing]

#TODO: Messed up the table creation. Will redo once JWT gets implemented
class ListingInDB(SQLModel, table=True):
    __tablename__ = "listings"
    __table_args__ = {'extend_existing': True}
    id: Optional[int] = Field(default=None, primary_key=True)
    #Not sure if we want titles to be unique or not...
    title: str = Field(unique=False)
    description: str = Field(sa_column=Text)
    # Decimal(precision, scale)
    price: Decimal = Field(sa_column=DECIMAL(10, 2))
    seller: str = Field(
        sa_column=Field(sa_column="users.username"),
    )
    created_at: Optional[datetime] = Field(default_factory=datetime.now)
    # I think this creates the foreign key relationship
    seller_id: Optional[int] = Field(default=None, foreign_key="users.id")
    seller_user: Optional[UserInDB] = Relationship(back_populates="listings")


#Token Schemas
    
class AccessToken(BaseModel):
    """Response model for an access token"""
    access_token: str
    token_type: str
    expires_in: int


class Claims(BaseModel):
    """Access token claims (aka payload)."""

    sub: str  # id of user
    exp: int  # unix timestamp
