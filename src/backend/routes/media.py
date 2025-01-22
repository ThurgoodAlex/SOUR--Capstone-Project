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
from databaseAndSchemas.schema import (
    Media, MediaInDB, createMedia, UserInDB, User, PostInDB
)
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user
from exceptions import DuplicateResource, EntityNotFound, PermissionDenied


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

@media_router.post('/uploadMedia', response_model=Media,status_code=201)
def upload_media(new_media : createMedia, session: Annotated[Session, Depends(get_session)]) -> Media:
    """Uploading a new image to the database"""
    mediaDb = MediaInDB(
        **new_media.model_dump()
    )
    session.add(mediaDb)
    session.commit()
    session.refresh(mediaDb)
    return Media(**new_media.model_dump())


@media_router.get('/', response_model=list[Media], status_code = 201)
def get_all_images(session : Annotated[Session, Depends(get_session)]) -> list[Media]:
    """Getting all images"""
    media_in_db = session.exec(select(MediaInDB)).all()
    # This is how we are maping from database images to images we show. This may need to be adjusted once we have to actually grab the image.
    return [Media(**media.model_dump()) for media in media_in_db]


## THis might need to be changed to image_url or something like that. Its currently off of the auto id in ImageInDB.
@media_router.get('/{media_id}', response_model= Media, status_code=201)
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
    
@media_router.get('/{user_id}/images', response_model=list[Media], status_code=201)
def get_images_by_user(
    session: Annotated[Session, Depends(get_session)], 
    user_id: int,
    current_user: UserInDB = Depends(auth_get_current_user)
) -> list[Media]:
    """Getting all images for a specific user (accessible by any authenticated user)."""
    
    # Get the user from the database based on the provided user_id
    user = session.get(UserInDB, user_id)

    # Check if the user exists in the database
    if not user:
        raise HTTPException(
            status_code=404,
            detail={
                "type": "entity_not_found",
                "entity_name": "user",
                "entity_id": user_id
            }
        )
    
    # Check if the MediaInDB model has the 'postID' attribute
    has_post_id = hasattr(MediaInDB, "postID")

    # Build the query to get images
    query = select(MediaInDB)
    if has_post_id:
        query = query.join(PostInDB, PostInDB.id == MediaInDB.postID).where(PostInDB.sellerID == user_id)
    else:
        raise HTTPException(
            status_code=400,
            detail="No valid columns found in the MediaInDB model.",
        )
    
    # Execute the query and retrieve the media
    media_in_db = session.exec(query).all()

    # Return the media as a list of Media objects
    return [Media(**media.model_dump()) for media in media_in_db]