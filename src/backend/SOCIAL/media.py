import os
import sys
import boto3
from botocore.exceptions import ClientError
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from datetime import datetime, timezone
from pydantic import BaseModel, ValidationError
from typing import Annotated
import logging
from jose import JWTError, jwt
from sqlmodel import(
    Session,
    SQLModel,
    select, 
    exists
) 
from exceptions import *
from databaseAndSchemas.schema import (
    Media, MediaInDB, UploadMedia, UserInDB, User, PostInDB, Delete
)
from databaseAndSchemas.test_db import get_session
from PRISM.auth import auth_get_current_user
from exceptions import EntityNotFound, PermissionDenied
from .socialexceptions import(
    InvalidFileType, 
    AssociatedPostNotFound,
    EmptyFileError
)

localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localhost:4566')

AWS_REGION = os.environ.get('CDK_DEFAULT_REGION', 'us-west-1')

AWS_ACCOUNT_ID = os.environ.get('CDK_DEFAULT_ACCOUNT', '000000000000')
    
s3_client = boto3.client('s3', region_name=AWS_REGION)

media_router = APIRouter(tags=["Media"])

@media_router.post("/upload/",response_model=Media, status_code=201)
async def upload_media( 
    session : Annotated[Session, Depends(get_session)], 
                        current_user: UserInDB = Depends(auth_get_current_user),
                        file: UploadFile = File(...),
                        post_id: int = Form(...),
                        ):
    """Endpoint used to upload images and videos to the backend"""

    try: 

        file_content = await file.read()

        if len(file_content) == 0:
            raise EmptyFileError()

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        file_mime_type = file.content_type.split("/")[0]

        if file_mime_type not in ["video", "image"]:
            raise InvalidFileType(file_mime_type)

        if not validate_post_id(session, post_id):
            raise AssociatedPostNotFound(post_id)      

        unique_filename = f"{current_user.id}/{post_id}/{file_mime_type}/{timestamp}_{file.filename}"

        s3_client.put_object(
            Bucket=f"sour-user-images-{AWS_ACCOUNT_ID}-{AWS_REGION}",
            Key=unique_filename,
            Body=file_content,
            ContentType=file.content_type
        )

        img_url = f"{localstack_endpoint}/sour-user-images-{AWS_ACCOUNT_ID}-{AWS_REGION}/{unique_filename}"

        file_is_video = False

        if file_mime_type == "video":
            file_is_video=True 
        
        media = MediaInDB(
            url= img_url,
            postID= post_id,
            isVideo= file_is_video
        )
        
        session.add(media)
        session.commit()
        session.refresh(media)

        return Media(**media.model_dump())

    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'NoSuchBucket':
           raise HTTPException(status_code=503, detail="S3 Bucket is unavailble") 

def validate_post_id(session:Session, post_id: int)-> bool:
   query = select(exists().where(PostInDB.id == post_id))
   return session.exec(query).first()
    

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
def del_media_by_id(
    media_id : int,
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


    