#!/usr/bin/env python3

from datetime import datetime
from decimal import Decimal
import mimetypes
import os
from sqlmodel import Session, select, SQLModel, create_engine 
import sys
import json
import boto3
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))
from SOCIAL import MediaUploader 
from databaseAndSchemas import *
from passlib.context import CryptContext
import os
from sqlalchemy import text

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
jwt_key = str(os.environ.get("JWT_KEY"))
jwt_alg = "HS256"

AWS_REGION = os.environ.get('CDK_DEFAULT_REGION', 'us-west-1')
AWS_ACCOUNT_ID = os.environ.get('CDK_DEFAULT_ACCOUNT', '000000000000')
POSTGRES_URL = os.environ.get('DATABASE_URL', "postgresql://root:password123@db:5432/sour-db")


s3_client = boto3.client('s3', region_name=AWS_REGION)

localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localhost:4566')
engine = create_engine(
    POSTGRES_URL,
    pool_pre_ping=True,
    echo=True,
)   
class Seeder:
    def __init__(self, filename:str):
        self.data = self.parse_json_file(filename)
        self.media_uploader = MediaUploader(
            AWS_REGION,
            AWS_ACCOUNT_ID, 
            localstack_endpoint,
            s3_client
        )

    def parse_json_file(self, filename:str):
        try:
            with open(filename, 'r') as file:
                config = json.load(file)
            return config
        except FileNotFoundError:
            print(f"Error: The file {filename} was not found.")
            return None
        except json.JSONDecodeError:
            print(f"Error: The file {filename} contains invalid JSON.")
            return None

    def create_users(self):
        with Session(engine) as session:
            for user in self.data["users"]:
                user_copy = user.copy()
                password = user_copy.pop("password")
                user_copy["hashed_password"] = pwd_context.hash(password)
                user_in_db = UserInDB(**user_copy)
                session.add(user_in_db)
            session.commit()
        session.execute(text("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))"))
            

    def create_posts(self):
       with Session(engine) as session:
            for post in self.data["posts"]:
                post_data = post.copy()
                print(post_data)
                
                post_images = []
                if "post_images" in post_data.keys():
                    post_images = post_data.pop("post_images")
                post_data = PostInDB(**post_data)
                session.add(post_data)
                session.commit()

                if len(post_images) > 0:
                    self.upload_post_media(
                        session,
                        post_images,
                        post_data.sellerID,
                        post_data.id
                    )
                
    def upload_post_media(
            self,
            session:Session,
            post_images:list[str],
            user_id:int,
            post_id:int
        ):
        for post_image in post_images:
                post_url, is_video= self.media_uploader.upload_Photo_to_S3(
                    post_image,
                    user_id,
                    post_id
                )
                media = MediaInDB(
                    postID=post_id,
                    url=post_url, 
                    isVideo=is_video
                )
                session.add(media)
        session.commit()
    
    
if __name__ == "__main__":

    if len(sys.argv) > 1:

        argument = sys.argv[1]

        confirm = ''
        while True:
            user_input = input("This will clear out all tables and rows in the database\n type yes to proceed, no to cancel:\n")
            if user_input == "yes":
                break
            elif user_input == "no":
                sys.exit()
            else:
                print(f"{confirm} is not a valid input\n")

        print("connected.. \n")

        print("dropping tables.. \n")
        SQLModel.metadata.drop_all(engine)

        print("creating tables...")
        SQLModel.metadata.create_all(engine)

        print(f"reading test database configuration file: {argument}")

        seeder = Seeder(argument)  

        seeder.create_users() 

        seeder.create_posts()
    else:
        print("No argument was provided. Usage: python script.py <argument>")