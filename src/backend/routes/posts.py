import os
import sys
import boto3
from fastapi import APIRouter, Depends, HTTPException, Path
from datetime import datetime, timezone
from typing import Annotated
import logging
from sqlalchemy.future import select
from jose import JWTError, jwt
from sqlmodel import Session, select
from databaseAndSchemas.schema import (
    PostInDB, Post, UserInDB, createPost, Delete, Link, LinkInDB, SellerStatInDB,
    Comment, CommentCreate, CommentInDB

)

from exceptions import *
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


@posts_router.post('/', response_model= Post, status_code=201)
def upload_post(newPost:createPost,  
                session: Annotated[Session, Depends(get_session)], 
                currentUser: UserInDB = Depends(auth_get_current_user)) -> Post:
    """Creating a new posting"""
    
    if not currentUser.isSeller:
        raise PermissionDenied("upload", "post")
        
    post = PostInDB(
        **newPost.model_dump(),
        sellerID=currentUser.id,
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


@posts_router.get('/', response_model= list[Post], )
def get_all_posts(session: Annotated[Session, Depends(get_session)], 
                  currentUser: UserInDB = Depends(auth_get_current_user))-> list[Post]:
    """Getting all posts"""
    post_in_db = session.exec(select(PostInDB)).all()
    return [Post(**post.model_dump()) for post in post_in_db]



@posts_router.post("/{post_id}/comments", response_model=Comment, status_code=201)
def create_new_comment(newComment: CommentCreate,
                    session: Annotated[Session, Depends(get_session)],
                    post_id: int,
                    current_user: UserInDB = Depends(auth_get_current_user)) -> Comment:
    """Create a new comment"""
    post = session.get(PostInDB, post_id)
    if post:
        comment_db = CommentInDB(
            userID=current_user.id,
            postID=post_id,
            comment=newComment.comment
        )
        session.add(comment_db)
        session.commit()
        session.refresh(comment_db)
    
        return Comment(**comment_db.model_dump())
    else:
        raise EntityNotFound("post", post_id)


@posts_router.get('/{post_id}/comments', response_model= list[Comment], status_code=200)
def get_comments_by_post(session: Annotated[Session, Depends(get_session)],
                        post_id: int,
                        current_user: UserInDB = Depends(auth_get_current_user))-> list[Comment]:
    """Get all comments for a certain post"""
    post = session.get(PostInDB, post_id)
    if post:
        comments_db = session.exec(select(CommentInDB).where(CommentInDB.postID == post_id)).all()
        return [Comment(**comment.model_dump()) for comment in comments_db]
    else:
        raise EntityNotFound("post", post_id)


@posts_router.get('/comments/{comment_id}', response_model= Comment, status_code=200)
def get_comment_by_id(session: Annotated[Session, Depends(get_session)],
                    comment_id: int,
                    current_user: UserInDB = Depends(auth_get_current_user))-> Comment:
    """Get comment by id"""
    comment =  session.get(CommentInDB, comment_id)
    if comment:
        return Comment(**comment.model_dump())
    else:
        raise EntityNotFound("comment", comment_id)



@posts_router.delete('/comments/{comment_id}', response_model= Delete, status_code=200)
def delete_comment(session :Annotated[Session, Depends(get_session)],
                    comment_id: int,
                    current_user: UserInDB = Depends(auth_get_current_user)) -> Delete:
    comment = session.get(CommentInDB, comment_id)
    if comment:
        comment = session.get(CommentInDB, comment_id)
        session.delete(comment)
        session.commit()
        return Delete(message="Successfully deleted comment")            
    else:
        raise EntityNotFound("comment", comment_id)




@posts_router.get('/{post_id}', response_model = list[Post], status_code=200)
def get_post_by_id(postId: int,
                   session: Annotated[Session, Depends(get_session)],
                   currentUser: UserInDB = Depends(auth_get_current_user)):
    posts_in_db = session.exec(select(PostInDB).where(PostInDB.id == postId))
    return [Post(**post.model_dump()) for post in posts_in_db]



@posts_router.delete('/{post_id}', response_model = Delete, status_code=200)
def del_post_by_id(postId : int, 
                   session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)):
    """Deleting post by id"""
    post = session.get(PostInDB, postId)
    if not post:
       #raise EntityNotFound("Post", postId)
       print("entity not found")
    if currentUser.id != post.sellerID:
        #raise PermissionDenied("delete", "post", currentUser.id)
        print("Permission Denied")
    
    session.delete(post)
    session.commit()
    return Delete(message="Post deleted successfully.")


# @posts_router.post('/{post_id}/link/{listing_id}', response_model= Link, status_code=201)
# def create_new_link(session: Annotated[Session, Depends(get_session)],
#                        post_id: int,
#                        listing_id: int,
#                        currentUser: UserInDB = Depends(auth_get_current_user)) -> Link:
#     """Creating a new link between a post and a listing"""
#     listing = session.get(PostInDB, listing_id)
#     post = session.get(PostInDB, post_id)
#     if post:
#         if listing:
#             linkDB = LinkInDB(
#                 listingID= listing_id,
#                 post_id= post_id
#             )
#             session.add(linkDB)
#             session.commit()
#             session.refresh(linkDB)
#             return map_link_db_to_response(linkDB)
#         else:
#             raise EntityNotFound("listing", post_id)
#     else:
#         raise EntityNotFound("post", post_id)

@posts_router.get('/{post_id}/links', response_model= list[int], status_code=200)
def get_all_links_by_post_id(session :Annotated[Session, Depends(get_session)],
                             post_id: int,
                             current_user: UserInDB = Depends(auth_get_current_user))-> list[int]:
    post = session.get(PostInDB, post_id)
    if post:
        return session.exec(select(LinkInDB.listingID).where(LinkInDB.postID == post_id)).first()
    else:
        raise EntityNotFound("post", post_id)

@posts_router.post('/{post_id}/like', response_model= Like, status_code=201)
def like_post(session :Annotated[Session, Depends(get_session)],
                             post_id: int,
                             current_user: UserInDB = Depends(auth_get_current_user))-> Like:
    post = session.get(PostInDB, post_id)
    if post:
        like = LikeInDB(
            postID=post_id,
            userID = current_user.id
        )
        session.add(like)
        session.commit()
        session.refresh(like)
        return Like(**like.model_dump())
    else:
        raise EntityNotFound("post", post_id)
    
@posts_router.delete('/{post_id}/unlike', response_model= Delete, status_code=200)
def unlike_post(session :Annotated[Session, Depends(get_session)],
                             post_id: int,
                             current_user: UserInDB = Depends(auth_get_current_user)) -> Delete:
    post = session.get(PostInDB, post_id)
    if post:
        like = session.exec(select(LikeInDB).where(LikeInDB.postID == post_id).where(LikeInDB.userID == current_user.id)).first()
        if like:
            session.delete(like)
            session.commit()
            return Delete(message="Successfully unliked post")
            
        else: 
            raise EntityNotFound("like for post", post_id)
            
    else:
        raise EntityNotFound("post", post_id)


#Returns True if like between user and post exists, False otherwise
@posts_router.get('/{post_id}/like', response_model= bool, status_code=200)
def get_like_of_post(session :Annotated[Session, Depends(get_session)],
                             post_id: int,
                             current_user: UserInDB = Depends(auth_get_current_user))-> bool:
    post = session.get(PostInDB, post_id)
    if post:
        like = session.exec(select(LikeInDB).where(LikeInDB.postID == post_id).where(LikeInDB.userID == current_user.id)).all()
        if like:
            return True
        else:
            return False
    else:
        raise EntityNotFound("post", post_id)
    


#this is here to test the seller stats route. May or may not keep this depending on how we want to do transactions...
@posts_router.put('/{post_id}/sold')
def post_sold(post_id: int, session :Annotated[Session, Depends(get_session)]):
    post = session.get(PostInDB, post_id)
    if not post:
        raise EntityNotFound("post", post_id)
    if post.isSold:
        return {"message": "Post is already marked as sold"}
    
    post.isSold = True
    session.add(post)
    seller_stat = session.exec(select(SellerStatInDB).where(SellerStatInDB.sellerID == post.sellerID)
    ).first()

    if seller_stat:
        seller_stat.itemsSold += 1
        seller_stat.totalEarnings += post.price
    else:
        seller_stat = SellerStatInDB(sellerID=post.sellerID, totalEarnings=post.price, itemsSold=1)

    session.add(seller_stat)
    session.commit()

    return {"message": "Post marked as sold and stats updated"}
        
