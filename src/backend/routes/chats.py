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
from sqlmodel import Session, SQLModel, select, desc

from databaseAndSchemas.schema import (
    Chat, ChatCreate, ChatInDB, Message, MessageCreate, MessageInDB, UserInDB
)
from databaseAndSchemas.test_db import get_session
from PRISM.src.prism_services.auth import auth_get_current_user


SessionDep = Annotated[Session, Depends(get_session)]
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/chats.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')

chats_router = APIRouter(tags=["Chats"])




@chats_router.post('/', response_model=Chat,status_code=201)
def upload_chat(new_chat : ChatCreate,
                session: Annotated[Session, Depends(get_session)], 
                currentUser: UserInDB = Depends(auth_get_current_user)
                ) -> Chat:
    """Uploading a new chat to the database"""
    
    # Check that other user exists
    user_check = session.get(UserInDB, new_chat.reciepientID)
    if not user_check:
        raise EntityNotFound("user", new_chat.reciepientID)
    
    if currentUser.id == new_chat.reciepientID:
        raise MethodNotAllowed("creating a chat with yourself")
    
    # Check to see if a chat already exists between these 2 users (check twice because it's bidirectional)
    chat_check1 = session.exec(select(ChatInDB.id).where(ChatInDB.senderID == currentUser.id).where(ChatInDB.recipientID == new_chat.reciepientID))
    if chat_check1.first() is not None:
        raise DuplicateResource('chat', 'users', str(currentUser.id) + " and " + str(new_chat.reciepientID))
    chat_check2 = session.exec(select(ChatInDB.id).where(ChatInDB.senderID == new_chat.reciepientID).where(ChatInDB.recipientID == currentUser.id))
    if chat_check2.first() is not None:
        raise DuplicateResource('chat', 'users', str(currentUser.id) + " and " + str(new_chat.reciepientID))
    
    
    #current user creating the chat is automatically the sender
    chat_db = ChatInDB(
        senderID = currentUser.id,
        recipientID = new_chat.reciepientID
    )
    
    session.add(chat_db)
    session.commit()
    session.refresh(chat_db)
    return Chat(**chat_db.model_dump())


@chats_router.post('/{chat_id}/messages', response_model=Message,status_code=201)
def upload_message(
                chat_id : int,
                new_message : MessageCreate,
                session: Annotated[Session, Depends(get_session)], 
                currentUser: UserInDB = Depends(auth_get_current_user)
                ) -> Message:
    """Uploading a new message to the database"""
    
    #check that chat exists
    chat_db = session.exec(select(ChatInDB).where(ChatInDB.id == chat_id)).first()
    if not chat_db:
        raise EntityNotFound("chat", chat_id)
    
    # Authenticate that the currently logged-in user is in this chat
    if not (chat_db.senderID == currentUser.id or chat_db.recipientID == currentUser.id):
        raise PermissionDenied("upload", "message")
    
    
    message_db = MessageInDB(
        chatID = chat_id,
        author = currentUser.id,
        message = new_message.message
    )
    
    
    session.add(message_db)
    session.commit()
    session.refresh(message_db)
    return Message(**message_db.model_dump())



@chats_router.get('/{chat_id}/messages', response_model=list[Message],status_code=200)
def get_messages(
                chat_id : int,
                session: Annotated[Session, Depends(get_session)], 
                currentUser: UserInDB = Depends(auth_get_current_user)
                ) -> list[Message]:
    """Uploading a new message to the database"""
    
   
    chat_db = session.exec(select(ChatInDB).where(ChatInDB.id == chat_id)).first()
    # Authenticate that the currently logged-in user is in this chat
    if not (chat_db.senderID == currentUser.id or chat_db.recipientID == currentUser.id):
        raise PermissionDenied("view", "messages")
    
    messages_db = (
    session.exec(
        select(MessageInDB)
        .where(MessageInDB.chatID == chat_id)
        .order_by(desc(MessageInDB.created_at))
    )
    .all()
)
    return [Message(**message_db.model_dump()) for message_db in messages_db]

