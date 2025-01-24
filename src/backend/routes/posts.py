import os
import sys
import boto3
from fastapi import APIRouter, Depends, HTTPException, Path
from datetime import datetime, timezone
from typing import Annotated
import logging
from sqlalchemy.future import select
from jose import JWTError, jwt
from sqlmodel import Session, SQLModel, select
from exceptions import *
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user
from databaseAndSchemas.mappings.userMapping import *
from exceptions import DuplicateResource, EntityNotFound
from databaseAndSchemas.schema import (
    PostInDB,
    Post,
    UserInDB,
    createPost,
    Delete,
    Link,
    LinkInDB,
    Media,
    MediaInDB
)


SessionDep = Annotated[Session, Depends(get_session)]
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/listings.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')


posts_router = APIRouter(tags=["Posts"])


@posts_router.post('/', response_model= Post, status_code=201)
def upload_post(new_post:createPost,  
                session: Annotated[Session, Depends(get_session)], 
                current_user: UserInDB = Depends(auth_get_current_user)) -> Post:
    """Creating a new posting"""
    
    if not current_user.isSeller:
        raise PermissionDenied("upload", "post")
        
    post = PostInDB(
        **new_post.model_dump(),
        sellerID=current_user.id,
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@posts_router.get('/', response_model= list[Post], )
def get_all_posts(session: Annotated[Session, Depends(get_session)], 
                  current_user: UserInDB = Depends(auth_get_current_user)) -> list[Post]:
    """Getting all posts"""
    posts_in_db = session.exec(select(PostInDB)).all()
    return [Post(**post.model_dump()) for post in posts_in_db]



@posts_router.get('/{post_id}/', response_model = Post, status_code=200)
def get_post_by_id(post_id: int, 
                   session: Annotated[Session, Depends(get_session)],
                   current_user: UserInDB = Depends(auth_get_current_user)) -> Post:
    post = session.get(PostInDB, post_id)
    if post:
        return Post(**post.model_dump())
    else:
        raise EntityNotFound("post", post_id)


@posts_router.delete('/{post_id}/', response_model = Delete, status_code=200)
def del_post_by_id(post_id : int, 
                   session: Annotated[Session, Depends(get_session)],
                   current_user: UserInDB = Depends(auth_get_current_user)) -> Delete:
    """Deleting post by id"""
    post = session.get(PostInDB, post_id)
    if not post:
       raise EntityNotFound("Post", post_id)
    if current_user.id != post.sellerID:
        raise PermissionDenied("delete", "post")
    
    session.delete(post)
    session.commit()
    return Delete(message="Post deleted successfully.")


@posts_router.post('/{post_id}/link/{listing_id}/', response_model= Link, status_code=201)
def create_new_link(session: Annotated[Session, Depends(get_session)],
                    post_id: int,
                    listing_id: int,
                    current_user: UserInDB = Depends(auth_get_current_user)) -> Link:
    """Creating a new link between a post and a listing"""
    listing = session.get(PostInDB, listing_id)
    post = session.get(PostInDB, post_id)
    if post:
        if listing:
            linkDB = LinkInDB(
                listingID= listing_id,
                postID= post_id
            )
            session.add(linkDB)
            session.commit()
            session.refresh(linkDB)
            return Link(**linkDB.model_dump())
        else:
            raise EntityNotFound("listing", post_id)
    else:
        raise EntityNotFound("post", post_id)

@posts_router.get('/{post_id}/links/', response_model= list[Link], status_code=200)
def get_all_links_by_post_id(session :Annotated[Session, Depends(get_session)],
                             post_id: int,
                             current_user: UserInDB = Depends(auth_get_current_user))-> list[Link]:
    post = session.get(PostInDB, post_id)
    if post:
        if post.isListing:
            links_in_db = session.exec(select(LinkInDB).where(LinkInDB.listingID == post_id)).all()
        else:
            links_in_db = session.exec(select(LinkInDB).where(LinkInDB.postID == post_id)).all()
        return [Link(**link.model_dump()) for link in links_in_db]
    else:
        raise EntityNotFound("post", post_id)

@posts_router.post('/{post_id}/media/', response_model=Media,status_code=201)
def upload_media(post_ID: int, 
                 new_media : createMedia, 
                 session: Annotated[Session, Depends(get_session)],
                 current_user: UserInDB = Depends(auth_get_current_user)) -> Media:
    """Uploading new media to a post"""
    post = session.get(PostInDB, post_ID)
    if not post:
        raise EntityNotFound("Post", post_ID)
    mediaDb = MediaInDB(
        **new_media.model_dump(),
        postID=post_ID,
    )
    if current_user.id != post.sellerID:
        raise PermissionDenied("upload", "media", current_user.id)
    session.add(mediaDb)
    session.commit()
    session.refresh(mediaDb)
    return Media(
        id=mediaDb.id,        
        postID=mediaDb.postID,
        **new_media.model_dump()
    )

@posts_router.get('/{post_id}/media/', response_model=list[Media], status_code=200)
def get_media_by_post(post_id: int,
                    session: Annotated[Session, Depends(get_session)], 
                    current_user: UserInDB = Depends(auth_get_current_user)) -> list[Media]:
    """Getting all media for a post"""
    post = session.get(PostInDB, post_id)

    if not post:
        raise EntityNotFound("post", post_id) 
    query = select(MediaInDB).where(MediaInDB.postID == post_id)
    media_in_db = session.exec(query).all()

    return [Media(**media.model_dump()) for media in media_in_db]