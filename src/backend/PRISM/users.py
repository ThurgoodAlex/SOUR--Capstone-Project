from operator import and_
from databaseAndSchemas.mappings.userMapping import map_user_db_to_response
from sqlalchemy import or_
import os
import sys
from exceptions import DuplicateResource, EntityNotFound, MethodNotAllowed, PermissionDenied
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
    Chat, ChatInDB, Following, UserInDB, User, SellerStat, SellerStatInDB,
    Post, PostInDB
)
from databaseAndSchemas.test_db import get_session
from PRISM import auth_get_current_user
from databaseAndSchemas import *


localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')

users_router = APIRouter(tags=["Users"])



# ------------------------ users -------------------------- #

@users_router.delete("/deleteuser/", response_model=Delete, status_code=200)
def delete_current_user(session: Annotated[Session, Depends(get_session)],
                    current_user: UserInDB = Depends(auth_get_current_user)) -> User:
    try:
        session.delete(current_user)
        session.commit()
        return Delete(message="Successfully deleted user")
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()

@users_router.get('/', response_model= list[User], status_code=200)
def get_all_users(session :Annotated[Session, Depends(get_session)])-> list[User]:
    """Gets all users"""
    user_in_db = session.exec(select(UserInDB)).all()
    return [map_user_db_to_response(user) for user in user_in_db]

@users_router.get('/{user_id}/', response_model= User, status_code=200)
def get_user_by_id(session: Annotated[Session, Depends(get_session)],
                    user_id: int,
                    current_user: UserInDB = Depends(auth_get_current_user))-> User:
    """Gets user by id"""
    user = session.get(UserInDB, user_id)
    if user:
        return map_user_db_to_response(user)
    else:
        raise EntityNotFound("user", user_id)

@users_router.put('/becomeseller/', response_model= User, status_code=200)
def become_a_seller(session: Annotated[Session, Depends(get_session)],
                        current_user: UserInDB = Depends(auth_get_current_user))-> User:
    """Update current logged in user to become a seller"""
    
    current_user.isSeller = True
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return map_user_db_to_response(current_user)

@users_router.put('/unregisterseller/', response_model= User, status_code=200)
def unregister_as_seller(session: Annotated[Session, Depends(get_session)],
                        current_user: UserInDB = Depends(auth_get_current_user))-> User:
    """Update current logged in user to unregister as seller"""
    
    current_user.isSeller = False
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    return map_user_db_to_response(current_user)
    


# ------------------------ followings -------------------------- #

@users_router.post('/{user_id}/follow/', response_model= Following, status_code=201)
def follow_user(session: Annotated[Session, Depends(get_session)],
                user_id: int,
                current_user: UserInDB = Depends(auth_get_current_user))-> Following:
    """Current User Follows a User with User ID"""
    user = session.get(UserInDB, user_id)
    if user_id != current_user.id:
        if user:
            currentFollow = len(session.exec(select(FollowingInDB).where((FollowingInDB.followerID == current_user.id) & (FollowingInDB.followeeID == user_id))).all())
            if currentFollow < 1:
                following_db = FollowingInDB(
                    followerID=current_user.id,
                    followeeID=user_id
                )
                session.add(following_db)
                session.commit()
                session.refresh(following_db)

                return Following(**following_db.model_dump())
            else:
                raise DuplicateResource('following', 'users', str(user_id) + ' and ' + str(current_user.id))
        else:
            raise EntityNotFound('user', user_id)
    else:
        raise MethodNotAllowed('following yourself')
    
@users_router.delete('/{user_id}/unfollow/', response_model= Delete, status_code=200)
def unfollow_user(session: Annotated[Session, Depends(get_session)],
                user_id: int,
                current_user: UserInDB = Depends(auth_get_current_user))-> Delete:
    """Current User unfollows a User with User ID"""
    if user_id != current_user.id:
        user = session.get(UserInDB, user_id)
        if user:
            currentFollow = session.exec(select(FollowingInDB).where(FollowingInDB.followerID == current_user.id).where(FollowingInDB.followeeID == user_id)).first()
            if currentFollow:
                session.delete(currentFollow)
                session.commit()

                return Delete(message="User successfully unfollowed.")
            else:
                raise EntityNotFound('following', f"{user_id} and {current_user.id}")
        else:
            raise EntityNotFound('user', user_id)
    else:
        raise MethodNotAllowed('unfollowing yourself')
    
@users_router.get('/{user_id}/following/', response_model= list[Following], status_code=200)
def get_following(session: Annotated[Session, Depends(get_session)],
                  user_id: int,
                  current_user: UserInDB = Depends(auth_get_current_user))-> list[Following]:
    """Get Who User is Following"""
    user = session.get(UserInDB, user_id)
    if user:
        followings_in_db = session.exec(select(FollowingInDB).filter(FollowingInDB.followerID == user_id)).all()
        return [Following(**following.model_dump()) for following in followings_in_db]
    else:
        raise EntityNotFound('user', user_id)
    
@users_router.get('/{user_id}/followers/', response_model= list[FollowingInDB], status_code=201)
def get_followers(session: Annotated[Session, Depends(get_session)],
                user_id: int,
                current_user: UserInDB = Depends(auth_get_current_user))-> list[FollowingInDB]:
    """Get Who Follows User"""
    user = session.get(UserInDB, user_id)
    if user:
        followings_in_db = session.exec(select(FollowingInDB).filter(FollowingInDB.followeeID == user_id)).all()
        return [Following(**following.model_dump()) for following in followings_in_db]
    else:
        raise EntityNotFound('user', user_id)



# ------------------------ chats -------------------------- #

@users_router.get('/{user_id}/chats/', response_model=list[Chat], status_code = 200)
def get_all_chats(user_id: int,  
                  session : Annotated[Session, Depends(get_session)],
                  current_user: UserInDB = Depends(auth_get_current_user)
                  ) -> list[Chat]:
    """Getting all chats for this user"""
    
    # check that user with id exists
    user = session.get(UserInDB, user_id)
    if not user:
        raise EntityNotFound("user", user_id)
    
    # Authenticate that the currently logged-in user matches the URL parameter
    if current_user.id != user_id:
        raise PermissionDenied("view", "chats")
    
    # Filter chats where the user is either the sender or the recipient
    chats_db = session.exec(
        select(ChatInDB).where(
            or_(
                ChatInDB.senderID == user_id,
                ChatInDB.recipientID == user_id
            )
        )
    ).all()
    #TODO: update schema to order by last_updated
    
    return [Chat(**chat_db.model_dump()) for chat_db in chats_db]

    

# ------------------------ posts -------------------------- #
@users_router.get('/{user_id}/posts/', response_model= list[Post], status_code=200)
def get_posts_for_user(user_id: int, 
                       session: Annotated[Session, Depends(get_session)], current_user: UserInDB = Depends(auth_get_current_user)) -> list[Post]:
    """Getting all posts for a specific user"""
    posts_in_db = session.exec(select(PostInDB).where(PostInDB.sellerID == user_id))
    return [Post(**post.model_dump()) for post in posts_in_db]          


@users_router.get('/{user_id}/posts/issold={is_sold}/', response_model = list[Post], status_code=200)
def get_posts_by_user(user_id: int,
                      is_sold: bool,
                      session: Annotated[Session, Depends(get_session)],
                      currentUser: UserInDB = Depends(auth_get_current_user)):
    user = session.get(UserInDB, user_id)
    if user:
        posts_in_db = session.exec(select(PostInDB).where(PostInDB.sellerID == user_id).where(PostInDB.isSold == is_sold)).all()
        return [Post(**post.model_dump()) for post in posts_in_db]
    else:
        raise EntityNotFound("user", user_id)



@users_router.get('/{user_id}/likes/', response_model= list[Post], status_code=200)
def get_liked_posts(user_id: int, 
                    session :Annotated[Session, Depends(get_session)],
                    current_user: UserInDB = Depends(auth_get_current_user))-> list[Post]:
    
     #fyi, even though I would prefer this route to not have the user_id part, 
     # it has to in order to resolve the url, otherwise it tries to parse "likes" as a user_id
     
     #so, instead just check that user_id is current user (assuming you can't view what someone else has liked)
     # check that user with id exists
    user = session.get(UserInDB, user_id)
    if not user:
        raise EntityNotFound("user", user_id)
    if user.id != current_user.id:
        raise PermissionDenied("view", "likes of another user")
    
    # Query the liked posts, joining with the Post table
    liked_posts = session.exec(
        select(PostInDB)
        .join(LikeInDB, PostInDB.id == LikeInDB.postID)
        .where(LikeInDB.userID == current_user.id)
        
    ).all()
    
    return [Post(**post.model_dump()) for post in liked_posts]
   
    
# ------------------------ Cart -------------------------- #
@users_router.get("/{user_id}/cart/", response_model=list[Cart], status_code=200)
def get_user_cart(

    session: Annotated[Session, Depends(get_session)],
    currentUser: UserInDB = Depends(auth_get_current_user)
) -> list[Cart]:
    
    
    user_cart = session.exec(select(CartInDB).where(CartInDB.userID == currentUser.id)).all()

    return [Cart(**item.model_dump()) for item in user_cart]

class CartRequest(BaseModel):
    listing_id: int

@users_router.post("/{user_id}/cart/", response_model=Cart, status_code=200)
def add_item_to_cart(
    request: CartRequest,
    session: Annotated[Session, Depends(get_session)],
    currentUser: UserInDB = Depends(auth_get_current_user)
) -> Cart:
    listing_id = request.listing_id 

    listing = session.exec(
        select(PostInDB).where(
            and_(PostInDB.id == listing_id, PostInDB.isListing == True)
        )
    ).first()

    if not listing:
        raise EntityNotFound("listing", listing_id)

    new_cart_item = CartInDB(
        userID=currentUser.id,
        listingID=listing.id,
        created_at=datetime.now()
    )

    session.add(new_cart_item)
    session.commit()
    session.refresh(new_cart_item)

    return Cart(
        id=new_cart_item.id,
        userID=new_cart_item.userID,
        listingID=new_cart_item.listingID,
        created_at=new_cart_item.created_at
    )

@users_router.delete("/users/{user_id}/cart/{cart_item_id}/", status_code=200)
def del_item_from_cart(
    cart_item_id: int,
    session: Annotated[Session, Depends(get_session)],
    currentUser: UserInDB = Depends(auth_get_current_user)
):
    
    cart_item = session.exec(
        select(CartInDB).where(
            and_(CartInDB.userID == currentUser.id, CartInDB.listingID == cart_item_id)
        )
    ).first()

    if not cart_item:
        raise EntityNotFound("cart item", cart_item_id)

    session.delete(cart_item)
    session.commit()

    return Delete(message="Item removed successfully from cart.")
# ------------------------ Stats -------------------------- #
@users_router.get("/{user_id}/stats/", response_model=SellerStat, status_code=200)
def get_stats_for_seller(user_id: int, session: Annotated[Session, Depends(get_session)], currentUser: UserInDB = Depends(auth_get_current_user)):

    user = session.get(UserInDB, user_id)

    if not user:
        raise EntityNotFound("user", user_id)
    
    user_stats = session.exec(select(SellerStatInDB).where(SellerStatInDB.sellerID == user.id)).first()

    if user_stats is None:
        raise EntityNotFound("stats for user", user.id)
    
    user_stats_response = SellerStat(**user_stats.model_dump())
    return user_stats_response



    
