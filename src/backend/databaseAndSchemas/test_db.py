import sqlite3
import json
import os
import boto3
from datetime import datetime
from sqlmodel import Session, SQLModel, create_engine, select#
from fastapi.testclient import TestClient
from sqlalchemy import text
import sys
import logging
from contextlib import asynccontextmanager
import warnings
import os

current_dir = os.path.dirname(os.path.abspath(__file__))

db_path = os.path.join(current_dir, "test_sour.db")

POSTGRES_URL = os.environ.get("DATABASE_URL", "postgresql://root:password123@db:5432/sour-db")

engine = create_engine(
    POSTGRES_URL,
    pool_pre_ping=True,
    echo=True,
)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)  # Create tables

    with Session(engine) as session:
        # Add search_vector column if it doesn’t exist
        session.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS search_vector tsvector;"))

        # Populate existing data
        session.execute(text("UPDATE posts SET search_vector = to_tsvector('english', title);"))

        # Create index
        session.execute(text("CREATE INDEX IF NOT EXISTS search_idx ON posts USING GIN (search_vector);"))

        # Create trigger function
        session.execute(text("""
        CREATE OR REPLACE FUNCTION update_search_vector() RETURNS TRIGGER AS $$ 
        BEGIN
          NEW.search_vector := to_tsvector('english', NEW.title);
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """))

        # Create trigger if it doesn't exist
        session.execute(text("""
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'search_vector_update') THEN
                CREATE TRIGGER search_vector_update
                BEFORE INSERT OR UPDATE ON posts
                FOR EACH ROW EXECUTE FUNCTION update_search_vector();
            END IF;
        END $$;
        """))

        session.commit()  # Save changes



def get_session():
    with Session(engine) as session:
        yield session


class EntityNotFoundException(Exception):
    def __init__(self, entity_name: str, entity_id: str):
        self.entity_name = entity_name
        self.entity_id = entity_id

