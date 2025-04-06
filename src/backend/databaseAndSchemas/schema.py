from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship
from pydantic import BaseModel, ConfigDict
from sqlalchemy.types import Text, DECIMAL
from decimal import Decimal
from fastapi import UploadFile

class Metadata(BaseModel):
    count: int 

class AccessToken(BaseModel):
    """Response model for an access token"""
    access_token: str
    token_type: str
    expires_in: int

class Claims(BaseModel):
    """Access token claims (aka payload)."""
    sub: str  # id of user
    exp: int  # unix timestamp

class TokenRequest(BaseModel):
    username: str
    password: str
    grant_type: str = "password"


class Delete(BaseModel):
    message: str

### All schemas for users ###
class UserInDB(SQLModel, table=True): 
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True} 
     
    profilePic: Optional[str] = Field(default=None)   
    id: Optional[int] = Field(default=None, primary_key=True)
    firstname: str = Field(index = False)
    lastname: str = Field(index = False)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True)
    bio: Optional[str]
    hashed_password: str
    isSeller: bool = Field(default=False, nullable=False)
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

class User(BaseModel):
    firstname: str
    lastname: str
    username: str
    profilePic: str
    email: str
    id: int
    isSeller:bool
 
class UserRegistration(BaseModel):
    firstname: str
    lastname: str
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str
    
class Password(BaseModel):
    password: str
###############################


### All Posts Schemas ###
class PostInDB(SQLModel, table = True):
    __tablename__ = "posts"
    id: Optional[int] = Field(default=None, primary_key=True)
    sellerID: int = Field(default=None, foreign_key="users.id")
    title: str = Field(unique=False)
    description: Optional[str] = Field(sa_column=Text)
    brand: Optional[str]
    condition: Optional[str]
    size: Optional[str]
    gender: Optional[str]
    coverImage: Optional[str] = Field(default=None)
    price: Optional[Decimal] = Field(sa_column=DECIMAL(10, 2))
    isSold: Optional[bool] = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.now)
    isListing: bool = Field(default=False, nullable=False)
    isVideo: Optional[bool] = Field(default=False, nullable=False)

class createPost(BaseModel):
    title: str
    description: Optional[str]
    isVideo: Optional[bool]
    
class createListing(BaseModel):
    title: str
    description: str
    brand: Optional[str]
    condition: Optional[str]
    size: Optional[str]
    gender: Optional[str]
    coverImage: Optional[str]
    price: Optional[Decimal]
    isListing: bool

class Post(BaseModel):
    id: int
    sellerID: int
    title: str
    description: Optional[str]
    brand: Optional[str]
    condition: Optional[str]
    size: Optional[str]
    gender: Optional[str]
    coverImage: Optional[str]
    price: Optional[Decimal]
    created_at: datetime
    isSold: bool
    isListing: bool
    isVideo: bool
    model_config = ConfigDict(from_attributes=True)

###############################

### All Color Schemas ###
class ColorInDB(SQLModel, table = True):
    __tablename__ = "colors"
    id: Optional[int] = Field(default=None, primary_key=True)
    postID: int = Field(foreign_key= "posts.id")
    color: str = Field(index=True)

class Color(BaseModel):
    id: int
    postID: int
    color: str
    model_config = ConfigDict(from_attributes=True)
################################

### All Media Schemas ###
class MediaInDB(SQLModel, table=True):
    __tablename__ = "media"
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str = Field(unique=True) 
    isVideo: bool
    postID: int  = Field(foreign_key="posts.id", index=True)

class createMedia(BaseModel):
    url: str
    isVideo: Optional[bool] = False

class Media(BaseModel):
    url: str
    id: int
    postID: int
    isVideo: bool
    # This allows us to map from imageInDB to an image
    model_config = ConfigDict(from_attributes=True)
    
class MediaListResponse(BaseModel):
    post_id: int 
    
class MediaListResponse(BaseModel):
    post_id: int 
    items: list[Media]
###############################


### All Likes Schemas ###
class LikeInDB(SQLModel, table = True):
    __tablename__ = "likes"
    id: Optional[int] = Field(default=None, primary_key=True)
    userID: int = Field(foreign_key="users.id")
    postID: int = Field(foreign_key= "posts.id")

class Like(BaseModel):
    id: int
    userID: int
    postID: int
    model_config = ConfigDict(from_attributes=True)

class LikeCreate(BaseModel):
    userID: int
    postID: int
###############################

### All Tag Schemas ###
class TagInDB(SQLModel, table = True):
    __tablename__ = "tags"
    id: Optional[int] = Field(default=None, primary_key=True)
    postID: int = Field(foreign_key= "posts.id")
    tag: str

class Tag(BaseModel):
    id: int
    postID: int
    tag: str
    model_config = ConfigDict(from_attributes=True)

class TagCreate(BaseModel):
    tag: str
###############################


### All Comments Schemas ###
class CommentInDB(SQLModel, table = True):
    __tablename__ = "comments"
    id: Optional[int] = Field(default=None, primary_key=True)
    userID: int = Field(foreign_key="users.id")
    postID: int = Field(foreign_key= "posts.id")
    comment: str
    created_at: datetime = Field(default_factory=datetime.now)

class Comment(BaseModel):
    id: int
    userID: int
    postID: int
    comment: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CommentCreate(BaseModel):
    comment: str
###############################


### All Following Schemas
class FollowingInDB(SQLModel, table = True):
    __tablename__ = "following"
    id: Optional[int] = Field(default=None, primary_key=True)
    followerID: int = Field(foreign_key="users.id")
    followeeID: int = Field(foreign_key="users.id")

class Following(BaseModel):
    id: int
    followerID: int
    followeeID: int
    model_config = ConfigDict(from_attributes=True)

class FollowingCreate(BaseModel):
    followerID: int
    followeeID: int
###############################


### All Link Schemas ###
class LinkInDB(SQLModel, table = True):
    __tablename__ = "links"
    id: Optional[int] = Field(default=None, primary_key=True)
    listingID: int = Field(foreign_key= "posts.id")
    postID: int = Field(foreign_key= "posts.id")

class Link(BaseModel):
    id: int
    listingID: int
    postID: int
    model_config = ConfigDict(from_attributes=True)

class LinkCreate(BaseModel):
    listingID: int
    postID: int
###############################


### ALl Chat Schemas ###
class ChatInDB(SQLModel, table = True):
    __tablename__ = "chats"
    id: Optional[int] = Field(default=None, primary_key=True)
    senderID: int = Field(foreign_key="users.id", index=True)
    recipientID: int = Field(foreign_key="users.id", index=True)

class Chat(BaseModel):
    id: int
    senderID: int
    recipientID: int
    model_config = ConfigDict(from_attributes=True)

class ChatCreate(BaseModel):
    reciepientID: int
###############################


### All Message Schemas ###
class MessageInDB(SQLModel, table = True):
    __tablename__ = "messages"
    id: Optional[int] = Field(default=None, primary_key=True)
    chatID: int = Field(default=None, foreign_key="chats.id", index=True)
    author: int = Field(foreign_key="users.id", index=True)
    message: str
    created_at: datetime = Field(default_factory=datetime.now)

class Message(BaseModel):
    id: int
    chatID: int
    author: int
    message: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MessageCreate(BaseModel):
    message: str
###############################


### All Cart Schemas ###
class CartInDB(SQLModel, table = True):
    __tablename__ = "cart"
    id: Optional[int] = Field(default=None, primary_key=True)
    userID: int = Field(foreign_key="users.id", index=True)
    listingID: int = Field(foreign_key= "posts.id")
    created_at: datetime = Field(default_factory=datetime.now)

class Cart(BaseModel):
    id: int
    userID: int
    listingID: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CartCreate(BaseModel):
    userID: int
    listingID: int
###############################


### All Seller Stat Schemas ###
class SellerStatInDB(SQLModel, table = True):
    __tablename__ = "sellerStats"
    id: Optional[int] = Field(default=None, primary_key=True)
    sellerID: int = Field(foreign_key="users.id", index=True)
    totalEarnings: Decimal = Field(default=0.00)
    itemsSold: int = Field(default=0)

class SellerStat(BaseModel):
    id: int
    sellerID: int
    totalEarnings: Decimal
    itemsSold: int
    model_config = ConfigDict(from_attributes=True)

class SellerStatCreate(BaseModel):
    sellerID: int
    totalEarnings: Decimal = 0.0
    itemsSold: int = 0
###############################