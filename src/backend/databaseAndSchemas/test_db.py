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
import os

current_dir = os.path.dirname(os.path.abspath(__file__))

db_path = os.path.join(current_dir, "test_sour.db")

engine = create_engine(
    f"sqlite:///{db_path}",
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

