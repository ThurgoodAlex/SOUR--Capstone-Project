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
from PRISM.src.prism_services.schema import (
    Listing, ListingResponse, ListingInDB, createListing, ListingList, User
)
from PRISM.src.prism_services.test_db import get_session
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



@listing_router.post('/createlisting', response_model= ListingResponse, status_code=201)
def create_new_listing(newListing:createListing, session: Annotated[Session, Depends(get_session)]) -> ListingResponse:
    """Creating a new listing"""
    listingDB = ListingInDB(
        **newListing.model_dump()
    )
    session.add(listingDB)
    session.commit()
    session.refresh(listingDB)
    #need to add seller info. First needs to implement JWT tokens.
    listing_data = Listing(title = listingDB.title, description=listingDB.description, price=listingDB.price)
    return ListingResponse(Listing=listing_data)