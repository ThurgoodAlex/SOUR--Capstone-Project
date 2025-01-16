

# import os
# import sys
# import boto3
# from fastapi import APIRouter, Depends, HTTPException
# from datetime import datetime, timezone
# from pydantic import BaseModel, ValidationError
# from typing import Annotated
# import logging
# from sqlalchemy.future import select
# from jose import JWTError, jwt
# from sqlmodel import Session, SQLModel, select
# from databaseAndSchemas.schema import (
#     Image, ImageInDB, ImageResponse, UserInDB, User, PostInDB, ListingInDB
# )
# from databaseAndSchemas.test_db import get_session
# from PRISM.src.prism_services.auth import auth_get_current_user


# SessionDep = Annotated[Session, Depends(get_session)]
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
#     handlers=[
#         logging.FileHandler('logs/images.log'),
#         logging.StreamHandler()
#     ]
# )
# logger = logging.getLogger(__name__)
# localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
# lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
#                              region_name='us-west-1',  # match with CDK stack region
#                              aws_access_key_id='test',
#                              aws_secret_access_key='test')


# images_router = APIRouter(tags=["Images"])

# @images_router.post('/uploadImage', response_model=ImageResponse,status_code=201)
# def upload_image(new_image : Image, session: Annotated[Session, Depends(get_session)]) -> ImageResponse:
#     """Uploading a new image to the database"""
#     imageDB = ImageInDB(
#         **new_image.model_dump()
#     )
#     session.add(imageDB)
#     session.commit()
#     session.refresh(imageDB)
#     return ImageResponse(Image=Image(url = imageDB.url, postID=imageDB.postID, listingID=imageDB.listingID))


# @images_router.get('/', response_model=list[Image], status_code = 201)
# def get_all_images(session : Annotated[Session, Depends(get_session)]) -> list[ImageInDB]:
#     """Getting all images"""
#     images_in_db = session.exec(select(ImageInDB)).all()
#     # This is how we are maping from database images to images we show. This may need to be adjusted once we have to actually grab the image.
#     return [Image.model_validate(image) for image in images_in_db]


# ## THis might need to be changed to image_url or something like that. Its currently off of the auto id in ImageInDB.
# @images_router.get('/{image_id}', response_model= Image, status_code=201)
# def get_image_by_id(session : Annotated[Session, Depends(get_session)], image_id : int) -> Image:
#     """Getting image by id"""
#     image = session.get(ImageInDB, image_id)
#     if image:
#         return Image.model_validate(image)
#     else:
#         raise HTTPException(
#                 status_code=404,
#                 detail={
#                     "type":"entity_not_found",
#                     "entity_name":"Image",
#                     "entity_id":image_id
#                 }
#             )
    
# @images_router.get('/{user_id}/images', response_model=list[Image], status_code=201)
# def get_images_by_user(session : Annotated[Session, Depends(get_session)], user_id : int) -> list[Image]:
#     """Getting all images for a specific user."""
#     user = session.get(UserInDB, user_id)
#     if user:
#         has_post_id = hasattr(ImageInDB, "postID")
#         has_listing_id = hasattr(ImageInDB, "listingID")

#         query = select(ImageInDB)
#         if has_post_id:
#             query = query.join(PostInDB, PostInDB.id == ImageInDB.postID).where(PostInDB.user_id == user_id)
#         elif has_listing_id:
#             query = query.join(ListingInDB, ListingInDB.id == ImageInDB.listingID).where(ListingInDB.user_id == user_id)
#         else:
#             raise HTTPException(
#                 status_code=400,
#                 detail="No valid columns found in the ImageInDB model.",
#             )
        
#         images_in_db = session.exec(query).all()
#         return [Image.model_validate(image) for image in images_in_db]
    
#     else:
#         raise HTTPException(
#                 status_code=404,
#                 detail={
#                     "type":"entity_not_found",
#                     "entity_name":"user",
#                     "entity_id":user_id
#                 }
#             )