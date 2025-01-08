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
from sour.src.backend.databaseAndSchemas.schema import (
    Listing, ListingResponse, ListingInDB, createListing, UserInDB
)
from sour.src.backend.databaseAndSchemas.test_db import get_session
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


listing_router = APIRouter(tags=["Listings"])


#TODO: add seller_id to the listing_data. First needs to implement JWT tokens.
@listing_router.post('/createlisting', response_model= ListingResponse, status_code=201)
def create_new_listing(newListing:createListing, session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)) -> ListingResponse:
    """Creating a new listing"""
    logger.info("testing create listing")
    listingDB = ListingInDB(
        **newListing.model_dump(),
        seller = currentUser.username,
        seller_id = currentUser.id,
        seller_user = currentUser,
    )
    session.add(listingDB)
    session.commit()
    session.refresh(listingDB)
    listing_data = Listing(title = listingDB.title, description=listingDB.description, price=listingDB.price, seller=listingDB.seller)
    return ListingResponse(Listing=listing_data)


@listing_router.get('/', response_model= list[ListingInDB], status_code=201)
def get_all_listings(session :Annotated[Session, Depends(get_session)])-> list[ListingInDB]:
    """Getting all listings"""
    return session.exec(select(ListingInDB)).all()

@listing_router.get('/{user_id}', response_model= list[ListingInDB], status_code=201)
def get_all_listings_by_user(session :Annotated[Session, Depends(get_session)], user_id: int)-> list[ListingInDB]:
    """Gets listing authored by a certain user"""
    user = session.get(UserInDB, user_id)
    logger.info("This is the user", user)
    if user:
        return session.exec(select(ListingInDB).where(ListingInDB.seller_id == user_id).order_by(ListingInDB.created_at.desc())).all()
    else:
        raise HTTPException(
                status_code=404,
                detail={
                    "type":"entity_not_found",
                    "entity_name":"user",
                    "entity_id":user_id
                }
            )

@listing_router.get('/{listing_id}', response_model= ListingInDB, status_code=201)
def get_all_listings_by_id(session :Annotated[Session, Depends(get_session)], listing_id: int)-> ListingInDB:
    """Gets listing by id"""
    listing = session.get(ListingInDB, listing_id)
    if listing:
        return listing
    else:
        raise HTTPException(
                status_code=404,
                detail={
                    "type":"entity_not_found",
                    "entity_name":"Listing",
                    "entity_id":listing_id
                }
            )

