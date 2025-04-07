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
from databaseAndSchemas import *  # Ensure TagInDB is part of the imported entities
from passlib.context import CryptContext
import os
from sqlalchemy import text
import cv2
import os
from uuid import uuid4


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
            reset_seq(session)

            
        

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
            session.commit()
            reset_seq(session)
                
    def upload_post_media(
        self,
        session: Session,
        post_images: list[str],
        user_id: int,
        post_id: int
    ):
        for post_image in post_images:
            # Upload main media
            post_url, is_video = self.media_uploader.upload_Photo_to_S3(
                post_image,
                user_id,
                post_id
            )

            cover_url = None

            if is_video:
                print("Video detected, extracting cover image...")
                # Extract a frame as cover image using cv2
                cover_path = self.extract_video_cover(post_image)
                if cover_path:
                    cover_url, _ = self.media_uploader.upload_Photo_to_S3(
                        cover_path,
                        user_id,
                        post_id
                    )
                    print(f"Cover image uploaded to {cover_url}")
                  

            # Save media record
            media = MediaInDB(
                postID=post_id,
                url=post_url,
                isVideo=is_video,
                coverImage=cover_url
            )
            session.add(media)
            
            if is_video:
                # Save media record for the cover image (MUST BE 2nd to the video above)
                cover_media = MediaInDB(
                    postID=post_id,
                    url=cover_url,
                    coverImage=cover_url,
                    isVideo=False
                )
                session.add(cover_media)

                
            
        session.commit()

    def extract_video_cover(self, video_path: str) -> str:
        
        cap = cv2.VideoCapture(video_path)
        success, frame = cap.read()
        cap.release()

        if success:
            filename = f"/tmp/{uuid4().hex}_cover.jpg"
            print(f"Saving cover image to {filename}")
            cv2.imwrite(filename, frame)
            return filename
        return None


    def create_follows(self):
        with Session(engine) as session:
            for follow_entry in self.data["follows"]:
                follower_id = follow_entry["followerID"]
                followee_id = follow_entry["followeeID"]
                
                follow = FollowingInDB(
                    followerID=follower_id,
                    followeeID=followee_id
                )
                session.add(follow)

            session.commit()
            print("Tags seeded successfully!")
            
    def create_tags(self):
        with Session(engine) as session:
            for tag_entry in self.data["tags"]:
                post_id = tag_entry["postID"]

                # Check if post exists before adding tags
                post_exists = session.exec(select(PostInDB).where(PostInDB.id == post_id)).first()
                if not post_exists:
                    print(f"Warning: Post with ID {post_id} not found. Skipping tags.")
                    continue
                print(tag_entry["tags"])
                for tag_name in tag_entry["tags"]:
                    print(f"Adding tag '{tag_name}' to post ID {post_id}")
                    tag = TagInDB(
                        postID=post_id,
                        tag=tag_name
                    )
                    session.add(tag)

            session.commit()
            print("Tags seeded successfully!")
            
    def create_colors(self):
        with Session(engine) as session:
            for color_entry in self.data["colors"]:
                post_id = color_entry["postID"]

                # Check if post exists before adding colors
                post_exists = session.exec(select(PostInDB).where(PostInDB.id == post_id)).first()
                if not post_exists:
                    print(f"Warning: Post with ID {post_id} not found. Skipping colors.")
                    continue
                print(color_entry["colors"])
                for color_name in color_entry["colors"]:
                    print(f"Adding color '{color_name}' to post ID {post_id}")
                    color = ColorInDB(
                        postID=post_id,
                        color=color_name
                    )
                    session.add(color)

            session.commit()
            print("Tags seeded successfully!")
            
    def create_links(self):
        with Session(engine) as session:
            for link_entry in self.data["links"]:
                post_id = link_entry["postID"]
                listing_id = link_entry["listingID"]

                # Check if post exists before adding links
                post_exists = session.exec(select(PostInDB).where(PostInDB.id == post_id)).first()
                if not post_exists:
                    print(f"Warning: Post with ID {post_id} not found. Skipping links.")
                    continue
                # Check if listing exists before adding links
                listing_exists = session.exec(select(PostInDB).where(PostInDB.id == listing_id)).first()
                if not listing_exists:
                    print(f"Warning: Listing with ID {listing_id} not found. Skipping links.")
                    continue
                
              
                print(f"Adding link between post ID {post_id} and listing ID {listing_id}")
                link = LinkInDB(
                    postID=post_id,
                    listingID=listing_id
                )
                session.add(link)

            session.commit()
            print("Links seeded successfully!")

def reset_seq(session):
    session.execute(text("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))"))
    session.execute(text("SELECT setval('media_id_seq', (SELECT MAX(id) FROM media))"))
    session.execute(text("SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts))"))
    session.execute(text("SELECT setval('links_id_seq', (SELECT MAX(id) FROM links))"))
    session.execute(text("SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags))")) 
    session.execute(text("SELECT setval('colors_id_seq', (SELECT MAX(id) FROM colors))"))
    session.execute(text("SELECT setval('following_id_seq', (SELECT MAX(id) FROM following))"))

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
        
        seeder.create_follows() 

        seeder.create_posts()
        
        seeder.create_tags()
        
        seeder.create_links()
        
        seeder.create_colors()
        
    else:
        print("No argument was provided. Usage: python script.py <argument>")