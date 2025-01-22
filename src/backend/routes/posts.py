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
from databaseAndSchemas.schema import (
    PostInDB, Post, UserInDB, createPost, Delete, Link, LinkInDB
)

from .excptions import *
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user
from databaseAndSchemas.mappings.mappings import *
from exceptions import DuplicateResource, EntityNotFound


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


@posts_router.post('/users/{user_id}/posts', response_model= Post, status_code=201)
def upload_post(newPost:createPost,  
                session: Annotated[Session, Depends(get_session)], 
                currentUser: UserInDB = Depends(auth_get_current_user)) -> Post:
    """Creating a new posting"""
    user = session.get(UserInDB, currentUser.id)
    if user != currentUser:
        #raise PermissionDenied("uploading post","post", currentUser.id)
        print("PermissionDenied")
    post = PostInDB(
        **newPost.model_dump(),
        sellerID=currentUser.id,
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@posts_router.get('/posts/', response_model= list[Post], )
def get_all_posts(session: Annotated[Session, Depends(get_session)], 
                  currentUser: UserInDB = Depends(auth_get_current_user))-> list[Post]:
    """Getting all posts"""
    post_in_db = session.exec(select(PostInDB)).all()
    return [Post(**post.model_dump()) for post in post_in_db]


@posts_router.get('/users/{user_id}/posts', response_model= list[Post], status_code=201)
def get_posts_for_user(userId: int, 
                       session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)) -> list[Post]:
    """Getting all posts for a specific user"""
    posts_in_db = session.exec(select(PostInDB).where(PostInDB.sellerID == userId))
    return [Post(**post.model_dump()) for post in posts_in_db]

@posts_router.get('/posts/{post_id}', response_model = list[Post], status_code=201)
def get_post_by_id(postId: int, 
                   session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)):
    posts_in_db = session.exec(select(PostInDB).where(PostInDB.id == postId))
    return [Post(**post.model_dump()) for post in posts_in_db]


@posts_router.delete('/posts/{post_id}', response_model = Delete, status_code=200)
def del_post_by_id(postId : int, 
                   session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)):
    """Deleting post by id"""
    post = session.get(PostInDB, postId)
    if not post:
       #raise EntityNotFound("Post", postId)
       print("entity not found")
    if currentUser.id != post.sellerID:
        #raise PermissionDenied("delete", "post", currentUser.id)
        print("Permission Denied")
    
    session.delete(post)
    session.commit()
    return Delete(message="Post deleted successfully.")


@posts_router.post('/{post_id}/link/{listing_id}', response_model= Link, status_code=201)
def create_new_link(session: Annotated[Session, Depends(get_session)],
                       post_id: int,
                       listing_id: int,
                       currentUser: UserInDB = Depends(auth_get_current_user)) -> Link:
    """Creating a new link between a post and a listing"""
    listing = session.get(PostInDB, listing_id)
    post = session.get(PostInDB, post_id)
    if post:
        if listing:
            linkDB = LinkInDB(
                listingID= listing_id,
                post_id= post_id
            )
            session.add(linkDB)
            session.commit()
            session.refresh(linkDB)
            return map_link_db_to_response(linkDB)
        else:
            raise EntityNotFound("listing", post_id)
    else:
        raise EntityNotFound("post", post_id)

@posts_router.get('/{post_id}/links', response_model= list[int], status_code=201)
def get_all_links_by_post_id(session :Annotated[Session, Depends(get_session)],
                             post_id: int,
                             current_user: UserInDB = Depends(auth_get_current_user))-> list[int]:
    post = session.get(PostInDB, post_id)
    if post:
        return session.exec(select(LinkInDB.listingID).where(LinkInDB.postID == post_id)).all()
    else:
        raise EntityNotFound("post", post_id)
