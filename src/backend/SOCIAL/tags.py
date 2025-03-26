import os
import boto3
from fastapi import APIRouter, Depends, Query
from typing import Annotated
from sqlalchemy.future import select
from sqlmodel import Session, select
from exceptions import *
from databaseAndSchemas.test_db import get_session
from PRISM.auth import auth_get_current_user
from databaseAndSchemas.mappings.userMapping import *
from exceptions import EntityNotFound
from databaseAndSchemas.schema import (
    PostInDB,
    UserInDB,
    Media,
    Post,
    Tag,
    TagInDB
)

SessionDep = Annotated[Session, Depends(get_session)]

localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')


tags_router = APIRouter(tags=["Tags"])

@tags_router.get('/', response_model=list[Post], status_code=200)
def get_posts_with_tag(
    session: Annotated[Session, Depends(get_session)], 
    tag: str = Query(..., description="The tag to filter posts by"),
    current_user: UserInDB = Depends(auth_get_current_user)
) -> list[Post]:
    """Getting all posts with a specific tag"""
    
    # Query to find the tag from the TagInDB table
    query = select(TagInDB).where(TagInDB.tag == tag)
    tags_in_db = session.exec(query).all()

    if not tags_in_db:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    # Find posts that are associated with the found tag(s)
    posts_in_db = []
    for tag_record in tags_in_db:
        # Query posts associated with the tag (using a many-to-many relationship table)
        query_posts = select(PostInDB).where(PostInDB.id == tag_record.postID)
    
        post = session.exec(query_posts).first()
        # check if already in list
        if post in posts_in_db:
            continue
        else:
            posts_in_db.append(post)
        
    
    return [Post(**post.model_dump()) for post in posts_in_db]
