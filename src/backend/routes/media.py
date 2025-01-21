import os
import sys
import boto3
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from pydantic import BaseModel, ValidationError
from typing import Annotated
import logging
from sqlalchemy.future import select
from jose import JWTError, jwt
from sqlmodel import Session, SQLModel, select
from .excptions import *
from databaseAndSchemas.schema import (
    Media, MediaInDB, createMedia, UserInDB, User, PostInDB, Delete
)
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user


SessionDep = Annotated[Session, Depends(get_session)]
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/media.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')

media_router = APIRouter(tags=["Media"])

@media_router.post('/posts/{post_id}/media/', response_model=Media,status_code=201)
def upload_media(post_ID: int, new_media : createMedia, session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)) -> Media:
    """Uploading new media to a post"""
    post = session.get(PostInDB, post_ID)
    if not post:
        raise EntityNotFound()
    mediaDb = MediaInDB(
        **new_media.model_dump(),
        postID=post_ID,
    )
    if currentUser.id != post.sellerID:
       raise PermissionDenied()
    session.add(mediaDb)
    session.commit()
    session.refresh(mediaDb)
    return Media(
        id=mediaDb.id,        
        postID=mediaDb.postID,
        **new_media.model_dump()
    )

#route used to test out upload.
@media_router.get('/media/', response_model=list[Media], status_code = 201)
def get_all_images(session : Annotated[Session, Depends(get_session)]) -> list[Media]:
    """Getting all images"""
    media_in_db = session.exec(select(MediaInDB)).all()
    return [Media(**media.model_dump()) for media in media_in_db]


@media_router.get('/media/{media_id}', response_model= Media, status_code=201)
def get_image_by_id(session : Annotated[Session, Depends(get_session)], media_id : int) -> Media:
    """Getting image by id"""
    media = session.get(MediaInDB, media_id)
    if media:
        return Media.model_validate(media)
    else:
        raise HTTPException(
                status_code=404,
                detail={
                    "type":"entity_not_found",
                    "entity_name":"Image",
                    "entity_id":media_id
                }
            )
    
@media_router.get('/posts/{post_id}/media/', response_model=list[Media], status_code=200)
def get_media_by_post(
    session: Annotated[Session, Depends(get_session)], 
    post_id: int,
    current_user: UserInDB = Depends(auth_get_current_user)
) -> list[Media]:
    post = session.get(PostInDB, post_id)

    if not post:
        #raise EntityNotFound("post", post_id)
        print("error")
    
    query = select(MediaInDB).where(MediaInDB.postID == post_id)
    
    media_in_db = session.exec(query).all()

    return [Media(**media.model_dump()) for media in media_in_db]


# @media_router.delete('/media/{media_id}', response_model = Delete, status_code=200)
# def del_post_by_id(mediaID : int, session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)):
#     """Deleting media by id"""
#     Media = session.get(MediaInDB, postId)
#     if not post:
#        #raise EntityNotFound(entity_name="Post", entity_id=postId)
#        print("entity not found")
#     if currentUser.id != post.sellerID:
#         #raise PermissionDenied(action="delete", resource="post")
#         print("Permission Denied")
    
#     session.delete(post)
#     session.commit()
#     return Delete(message="Post deleted successfully.")
