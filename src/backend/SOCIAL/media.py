import os
import sys
import boto3
from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, HTTPException, UploadFile
from datetime import datetime, timezone
from pydantic import BaseModel, ValidationError
from typing import Annotated
import logging
from sqlalchemy.future import select
from jose import JWTError, jwt
from sqlmodel import Session, SQLModel, select
from exceptions import *
from databaseAndSchemas.schema import (
    Media, MediaInDB, createMedia, UserInDB, User, PostInDB, Delete
)
from databaseAndSchemas.test_db import get_session
from PRISM.auth import auth_get_current_user
from exceptions import DuplicateResource, EntityNotFound, PermissionDenied


localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')

REGION = os.environ.get('CDK_DEFAULT_REGION', 'us-west-1')

s3_client = boto3.client('s3', region_name=REGION)

media_router = APIRouter(tags=["Media"])

@media_router.post("/upload/", response_model=Media, status_code=201)
async def upload_media( file:UploadFile, session : Annotated[Session, Depends(get_session)], 
                  current_user: UserInDB = Depends(auth_get_current_user)):
    try: 

        file_content = await file.read()

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{current_user.id}_{timestamp}_{file.filename}"

        # Upload to S3 using put_object
        response = s3_client.put_object(
            Bucket="sour-user-images-000000000000-us-west-1",
            Key=unique_filename,
            Body=file_content,
            ContentType=file.content_type
        )

        print(response)

        # Generate the URL for the uploaded file
        img_url = f"{localstack_endpoint}/sour-user-images-000000000000-us-west-1/{unique_filename}"

        
        # Create media record
        media = MediaInDB(
            url= img_url,
            postID=1,
            isVideo=False
        )
        
        # Save to database
        session.add(media)
        session.commit()

    except ClientError as e:
        return False
    return True

    
    

#route used to test out upload.
@media_router.get('/', response_model=list[Media], status_code = 200)
def get_all_media(session : Annotated[Session, Depends(get_session)],
                   current_user: UserInDB = Depends(auth_get_current_user)) -> list[Media]:
    """Getting all media"""
    media_in_db = session.exec(select(MediaInDB)).all()
    return [Media(**media.model_dump()) for media in media_in_db]

@media_router.get('/{media_id}/', response_model= Media, status_code=200)
def get_media_by_id(media_id : int,
                    session : Annotated[Session, Depends(get_session)],
                    current_user: UserInDB = Depends(auth_get_current_user)) -> Media:
    """Getting media by id"""
    media = session.get(MediaInDB, media_id)
    if not media:
        #raise EntityNotFound("Media", media_id)
        print("EntityNotFound")
   
    return Media(**media.model_dump())


@media_router.delete('/{media_id}/', response_model = Delete, status_code=200)
def del_media_by_id(media_id : int,
                    session: Annotated[Session, Depends(get_session)],
                    current_user: UserInDB = Depends(auth_get_current_user)):
    """Deleting media by id"""

    media = session.get(MediaInDB, media_id)
    if not media:
       raise EntityNotFound("media", media_id)

    post = session.exec(select(PostInDB).where(PostInDB.id == media.postID)).first()
    if not post:
        raise EntityNotFound("post", post.id)

    if current_user.id != post.sellerID:
        raise PermissionDenied("delete", "post", current_user.id)
    
    session.delete(media)
    session.commit()
    return Delete(message="Media deleted successfully.")


    