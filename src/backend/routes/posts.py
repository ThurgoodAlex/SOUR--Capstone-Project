import os
import sys
import boto3
from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from typing import Annotated
import logging
from sqlalchemy.future import select
from jose import JWTError, jwt
from sqlmodel import Session, select
from databaseAndSchemas.schema import (
    Comment, CommentCreate, CommentInDB, PostInDB, Post, UserInDB
)
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user
from databaseAndSchemas.mappings.mappings import *


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


#TODO: add seller_id to the listing_data. First needs to implement JWT tokens.
# @posts_router.post('/createlisting', response_model= Post, status_code=201)
# def create_new_listing(newPost:createListing, session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)) -> Post:
#     """Creating a new listing"""
#     logger.info("testing create listing")
#     listingDB = PostInDB(
#         **newListing.model_dump(),
#         seller = currentUser.username,
#         seller_id = currentUser.id,
#         seller_user = currentUser,
#     )
#     session.add(listingDB)
#     session.commit()
#     session.refresh(listingDB)
#     listing_data = Listing(title = listingDB.title, description=listingDB.description, price=listingDB.price, seller=listingDB.seller)
#     return ListingResponse(Listing=listing_data)


# @posts_router.get('/', response_model= list[ListingInDB], status_code=201)
# def get_all_listings(session :Annotated[Session, Depends(get_session)])-> list[ListingInDB]:
#     """Getting all listings"""
#     return session.exec(select(ListingInDB)).all()

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

@posts_router.post("/{post_id}/comments", response_model=Comment, status_code=201)
def create_new_comment(newComment: CommentCreate,
                    session: Annotated[Session, Depends(get_session)],
                    post_id: int,
                    current_user: UserInDB = Depends(auth_get_current_user)) -> Comment:
    """Create a new comment"""
    post = session.get(PostInDB, post_id)
    if current_user.id == newComment.userID and post and post_id == newComment.postID:
        try:
            comment_db = CommentInDB(
                userID=newComment.userID,
                postID=newComment.postID,
                comment=newComment.comment
            )
            session.add(comment_db)
            session.commit()
            session.refresh(comment_db)
        
            return map_comment_db_to_comment(comment_db)
        
        except Exception as e:
            raise HTTPException(status_code=500, detail="An unexpected error occurred.")
    else:
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")
    
@posts_router.get('/{post_id}/comments', response_model= CommentInDB, status_code=201)
def get_comments_by_post(session: Annotated[Session, Depends(get_session)],
                                post_id: int,
                                current_user: UserInDB = Depends(auth_get_current_user))-> list[CommentInDB]:
    """Get all comments for a certain post"""
    post = session.get(PostInDB, post_id)
    if post:
        return session.exec(select(CommentInDB).where(CommentInDB.postID == post_id)).all()
    else:
        raise HTTPException(
            status_code=404,
            detail={
                "type":"entity_not_found",
                "entity_name":"post",
                "entity_id":post_id
            }
        )
    
@posts_router.get('/{post_id}/comments/{comment_id}', response_model= CommentInDB, status_code=201)
def get_comment_by_id(session: Annotated[Session, Depends(get_session)],
                    post_id: int,
                    comment_id: int,
                    current_user: UserInDB = Depends(auth_get_current_user))-> list[CommentInDB]:
    """Get comment by id"""
    post = session.get(PostInDB, post_id)
    if post:
        comment =  session.get(CommentInDB, comment_id)
        if comment:
            return comment
        else:
            raise HTTPException(
                status_code=404,
                detail={
                    "type":"entity_not_found",
                    "entity_name":"comment",
                    "entity_id":comment_id
                }
            )
    else:
        raise HTTPException(
            status_code=404,
            detail={
                "type":"entity_not_found",
                "entity_name":"post",
                "entity_id":post_id
            }
        )