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
    Image, ImageInDB, ImageResponse
)
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user


SessionDep = Annotated[Session, Depends(get_session)]
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/images.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')


images_router = APIRouter(tags=["Images"])


#In this, I decided that Image and CreateImage are the same thing since both requires URL, and associated links.
#If need be, this can be easily changed
@images_router.post('/uploadImage', response_model=ImageResponse,status_code=201)
def upload_image(new_image : Image, session: Annotated[Session, Depends(get_session)]) -> ImageResponse:
    """Uploading a new image to the database"""
    imageDB = ImageInDB(
        **new_image.model_dump()
    )
    session.add(imageDB)
    session.commit()
    session.refresh(imageDB)
    return ImageResponse(Image=Image(url = imageDB.url, postID=imageDB.postID, listingID=imageDB.listingID))