import os
import sys
import boto3
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from typing import Annotated
import logging
from sqlalchemy.future import select
from jose import JWTError, jwt
from sqlmodel import Session, SQLModel, select
from databaseAndSchemas.schema import (
    PostInDB, Post, UserInDB, createPost
)
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user


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
def upload_post(newPost:createPost, session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)) -> Post:
    """Creating a new posting"""
    post = PostInDB(
        **newPost.model_dump(),
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@posts_router.get('/posts/', response_model= list[Post], status_code=201)
def get_all_posts(session :Annotated[Session, Depends(get_session)])-> list[Post]:
    """Getting all posts"""
    post_in_db = session.exec(select(PostInDB)).all()
    return [Post(**post.model_dump()) for post in post_in_db]

# @posts_router.get('/{user_id}/listings', response_model= list[ListingInDB], status_code=201)
# def get_all_listings_by_user(session :Annotated[Session, Depends(get_session)], user_id: int)-> list[ListingInDB]:
#     """Gets listing authored by a certain user"""
#     user = session.get(UserInDB, user_id)
#     logger.info(f"This is the user: {user}")
#     if user:
#         return session.exec(select(ListingInDB).where(ListingInDB.seller_id == user_id).order_by(ListingInDB.created_at.desc())).all()
#     else:
#         raise HTTPException(
#                 status_code=404,
#                 detail={
#                     "type":"entity_not_found",
#                     "entity_name":"user",
#                     "entity_id":user_id
#                 }
#             )

# @posts_router.get('/{listing_id}', response_model= ListingInDB, status_code=201)
# def get_all_listings_by_id(session :Annotated[Session, Depends(get_session)], listing_id: int)-> ListingInDB:
#     """Gets listing by id"""
#     listing = session.get(ListingInDB, listing_id)
#     logger.info(f"This is the listing: {listing}")
#     if listing:
#         return listing
#     else:
#         raise HTTPException(
#                 status_code=404,
#                 detail={
#                     "type":"entity_not_found",
#                     "entity_name":"Listing",
#                     "entity_id":listing_id
#                 }
#             )
