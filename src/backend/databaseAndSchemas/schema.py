from datetime import datetime
from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship
from pydantic import BaseModel, ConfigDict
from sqlalchemy.types import Text, DECIMAL
from decimal import Decimal


class Metadata(BaseModel):
    count: int 

#USer DB table

class UserInDB(SQLModel, table=True): 
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}  
    profilePic: Optional[str] = Field(default=None, foreign_key="media.url")
    id: int = Field(default=None, primary_key=True)
    firstname: str = Field(index = False)
    lastname: str = Field(index = False)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True)
    bio: Optional[str]
    hashed_password: str
    isSeller: bool = Field(default=False, nullable=False)
    created_at: Optional[datetime] = Field(default_factory=datetime.now)

#All schemas for users

class User(BaseModel):
    firstname: str
    lastname: str
    username: str
    profilePic: str
    email: str
    id: int
    isSeller:bool
    model_config = ConfigDict(from_attributes=True)
    


class UserResponse(BaseModel):
    user: User

class UserRegistration(BaseModel):
    firstname: str
    lastname: str
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
    brand: str
    condition: str
    size: str
    gender: str
    price: Decimal 
    sellerID: int 
    isSold: bool


#backend sends this
class Listing(BaseModel):
    id: int
    title: str 
    description: str
    brand: str
    condition: str
    size: str
    gender: str
    price: Decimal 
    sellerID: int 
    isSold: bool


    # need this to convert decimal from scientific notation to normal.
    class Config:
        json_encoders = {
            Decimal: lambda v: f"{v:.2f}"  \
        }


#cleaner way to hold a Listing
class ListingResponse(BaseModel):
    Listing: Listing


#class ListingList(BaseModel):
    #meta: Metadata
    #listings: list[Listing]

#TODO: Messed up the table creation. Will redo once JWT gets implemented
class ListingInDB(SQLModel, table=True):
    __tablename__ = "listings"
    __table_args__ = {'extend_existing': True}
    id: int = Field(default=None, primary_key=True)
    title: str = Field(unique=False)
    description: Optional[str] = Field(sa_column=Text)
    brand: str = Field()
    condition: str = Field()
    size: str = Field()
    gender: str = Field()
    coverImage: str = Field()
    # Decimal(precision, scale)
    price: Decimal = Field(sa_column=DECIMAL(10, 2))
    created_at: datetime = Field(default_factory=datetime.now)
    # I think this creates the foreign key relationship
    sellerID: int = Field(default=None, foreign_key="users.id")
    isSold: bool = Field(default=False, nullable=False)


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

## Image Schemas


class createMedia(BaseModel):
    url: str
    postID: Optional[int] = None
    listingID: Optional[int] = None
    isVideo: bool


class Media(BaseModel):
    url: str
    postID: Optional[int] = None
    listingID: Optional[int] = None
    isVideo: bool
    # This allows us to map from imageInDB to an image
    model_config = ConfigDict(from_attributes=True)


class MediaResponse(BaseModel):
    Media: Media


class MediaInDB(SQLModel, table=True):
    __tablename__ = "media"
    id: int = Field(default=None, primary_key=True)
    url: str = Field(unique=True) 
    isVideo: bool
    postID: Optional[int]  = Field(default=None, foreign_key="posts.id", index=True)
    listingID: Optional[int] = Field(default=None, foreign_key="listings.id", index=True)


## Posts Schemas

class createPost(BaseModel):
    title: Optional[str]
    caption: Optional[str]
    sellerID: int


class Post(BaseModel):
    title: Optional[str]
    caption: Optional[str]
    sellerID: int
    model_config = ConfigDict(from_attributes=True)


class PostResponse(BaseModel):
    Post: Post


class PostInDB(SQLModel, table = True):
    __tablename__ = "posts"
    title: Optional[str]
    id: int = Field(default=None, primary_key=True)
    caption: Optional[str]
    sellerID: int = Field(foreign_key="users.id")  # Foreign key to UserInDB
    created_at: datetime = Field(default_factory=datetime.now)
    coverImage: str


class LikesInDB(SQLModel, table = True):
    __tablename__ = "Likes"
    id: int = Field(default=None, primary_key=True)
    userID: int = Field(foreign_key="users.id")
    postID: Optional[int] = Field(foreign_key= "posts.id")
    listingID: Optional[int] = Field(foreign_key= "listings.id")


class CommentsInDB(SQLModel, table = True):
    __tablename__ = "Comments"
    id: int = Field(default=None, primary_key=True)
    userID: int = Field(foreign_key="users.id")
    postID: Optional[int] = Field(foreign_key= "posts.id")
    listingID: Optional[int] = Field(foreign_key= "listings.id")
    comment: str
    created_at: datetime = Field(default_factory=datetime.now)
    

class FollowingsInDB(SQLModel, table = True):
    __tablename__ = "FollowingAndFolowees"
    id: int = Field(default=None, primary_key=True)
    followerID: int = Field(foreign_key="users.id")
    followeeID: int = Field(foreign_key="users.id")


class LinksInDB(SQLModel, table = True):
    __tablename__ = "Links"
    id: int = Field(default=None, primary_key=True)
    listingID: int = Field(foreign_key= "listings.id")
    postID: int = Field(foreign_key= "posts.id")



class ChatsInDB(SQLModel, table = True):
    __tablename__ = "Chats"
    id: int = Field(default=None, primary_key=True)
    senderID: int = Field(foreign_key="users.id", index=True)
    senderID: int = Field(foreign_key="users.id", index=True)


class MessagesInDB(SQLModel, table = True):
    __tablename__ = "Messages"
    id: int = Field(default=None, primary_key=True)
    chatID: int = Field(default=None, foreign_key="Chats.id", index=True)
    author: int = Field(foreign_key="users.id", index=True)
    message: str
    created_at: datetime = Field(default_factory=datetime.now)


class CartInDB(SQLModel, table = True):
    __tablename__ = "Cart"
    id: int = Field(default=None, primary_key=True)
    userID: int = Field(foreign_key="users.id", index=True)
    listingID: int = Field(foreign_key= "listings.id")
    created_at: datetime = Field(default_factory=datetime.now)


class SellerStatsInDB(SQLModel, table = True):
    __tablename__ = "SellerStats"
    id: int = Field(default=None, primary_key=True)
    sellerID: int = Field(foreign_key="users.id", index=True)
    totalEarnings: Decimal = Field(default=0.00)
    itemsSold: int = Field(default=0)



class LikeResponse(BaseModel):
    id: int
    userID: int
    postID: Optional[int]
    listingID: Optional[int]
    model_config = ConfigDict(from_attributes=True)

class CommentResponse(BaseModel):
    id: int
    userID: int
    postID: Optional[int]
    listingID: Optional[int]
    comment: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class FollowingResponse(BaseModel):
    id: int
    followerID: int
    followeeID: int
    model_config = ConfigDict(from_attributes=True)

class LinkResponse(BaseModel):
    id: int
    listingID: int
    postID: int
    model_config = ConfigDict(from_attributes=True)

class ChatResponse(BaseModel):
    id: int
    senderID: int
    recipientID: int
    model_config = ConfigDict(from_attributes=True)

class MessageResponse(BaseModel):
    id: int
    chatID: int
    author: int
    message: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    id: int
    userID: int
    listingID: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class SellerStatResponse(BaseModel):
    id: int
    sellerID: int
    totalEarnings: Decimal
    itemsSold: int
    model_config = ConfigDict(from_attributes=True)






class LikeCreate(BaseModel):
    userID: int
    postID: Optional[int]
    listingID: Optional[int]

class CommentCreate(BaseModel):
    userID: int
    postID: Optional[int]
    listingID: Optional[int]
    comment: str

class FollowingCreate(BaseModel):
    followerID: int
    followeeID: int

class LinkCreate(BaseModel):
    listingID: int
    postID: int

class ChatCreate(BaseModel):
    senderID: int
    reciepientID: int

class MessageCreate(BaseModel):
    chatID: int
    author: int
    message: str

class CartCreate(BaseModel):
    userID: int
    listingID: int

class SellerStatCreate(BaseModel):
    sellerID: int
    totalEarnings: Decimal = 0.0
    itemsSold: int = 0