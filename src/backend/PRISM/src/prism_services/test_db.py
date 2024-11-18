import sqlite3
import json
import os
import boto3
from datetime import datetime
from sqlmodel import Session, SQLModel, create_engine, select#
from fastapi.testclient import TestClient
import sys
import logging
from contextlib import asynccontextmanager
import warnings

from .schema import(
    UserInDB
)


engine = create_engine(
    f"sqlite:///./test_prism.db",
    pool_pre_ping=True,
    echo=True,
    connect_args={"check_same_thread": False},
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session


class EntityNotFoundException(Exception):
    def __init__(self, entity_name: str, entity_id: str):
        self.entity_name = entity_name
        self.entity_id = entity_id


def get_all_users(session: Session) -> list[UserInDB]:
    """
    Retrieve all users from the database.

    :return: ordered list of users
    """

    return session.exec(select(UserInDB)).all()

