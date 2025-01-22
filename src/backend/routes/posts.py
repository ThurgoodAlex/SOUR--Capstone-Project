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
    Link, LinkInDB, PostInDB, Post, UserInDB
)
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
