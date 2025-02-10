from datetime import datetime
from decimal import Decimal
from sqlmodel import Session, select, SQLModel, create_engine
import os
from passlib.context import CryptContext
from databaseAndSchemas import  (
    UserInDB, PostInDB, MediaInDB, LikeInDB, 
    CommentInDB, FollowingInDB, LinkInDB, 
    ChatInDB, MessageInDB, CartInDB, SellerStatInDB
)
from .database_config import engine 
from sqlalchemy import create_engine, text
"""
This database seeder is meant to used for manual testing in dev environments.
This isn't used for unit tests, instead each unit test module has it's own test db instance. 
"""

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_database():
    """Seed the database with sample data"""
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        users = [
            UserInDB(
                firstname="John",
                lastname="Doe",
                username="johndoe",
                email="john@example.com",
                bio="A regular user",
                hashed_password=pwd_context.hash("password123"),
                isSeller=False
            ),
            UserInDB(
                firstname="Jane",
                lastname="Smith",
                username="janesmith",
                email="jane@example.com",
                bio="A seller account",
                hashed_password=pwd_context.hash("password123"),
                isSeller=True
            ),
            UserInDB(
                firstname="Bob",
                lastname="Wilson",
                username="bobwilson",
                email="bob@example.com",
                bio="Another seller",
                hashed_password=pwd_context.hash("password123"),
                isSeller=True
            ),
            UserInDB(
                firstname="Ricardo",
                lastname="Baeza",
                username="ricardobaeza",
                email="baezaricardo@proton.me",
                bio="Khajit has wares, if you have coin",
                hashed_password=pwd_context.hash("password123"),
                isSeller=True
            )

        ]
        
        for user in users:
            session.add(user)
        session.commit()

        JANE_SELLER_ID = session.exec(select(UserInDB.id).where(UserInDB.username ==  "janesmith")).first()
        BOB_SELLER_ID = session.exec(select(UserInDB.id).where(UserInDB.username == "bobwilson")).first()

        posts = [
            PostInDB(
                sellerID=JANE_SELLER_ID,  
                title="Vintage Denim Jacket",
                description="Beautiful vintage Levi's jacket from the 90s",
                brand="Levi's",
                condition="Good",
                size="M",
                gender="Unisex",
                price=Decimal("89.99"),
                isListing=True
            ),
            PostInDB(
                sellerID=JANE_SELLER_ID,
                title="My Style Today",
                description="Check out this awesome outfit!",
                isListing=False
            ),
            PostInDB(
                sellerID=BOB_SELLER_ID,  # Bob's ID
                title="Nike Sneakers",
                description="Nearly new Nike Air Max",
                brand="Nike",
                condition="Like New",
                size="US 10",
                gender="Men",
                price=Decimal("120.00"),
                isListing=True
            )
        ]
        
        for post in posts:
            session.add(post)
        session.commit()

        JOHN_USER_ID =  session.exec(select(UserInDB.id).where(UserInDB.username ==  "johndoe")).first()



        # Add some media
        media = [
            MediaInDB(
                url="https://example.com/jacket1.jpg",
                isVideo=False,
                postID=1
            ),
            MediaInDB(
                url="https://example.com/outfit1.jpg",
                isVideo=False,
                postID=2
            ),
            MediaInDB(
                url="https://example.com/sneakers1.jpg",
                isVideo=False,
                postID=3
            )
        ]
        
        for item in media:
            session.add(item)
        session.commit()

        # Add some likes
        likes = [
            LikeInDB(userID=JOHN_USER_ID, postID=1),
            LikeInDB(userID=JOHN_USER_ID, postID=2),
            LikeInDB(userID=JOHN_USER_ID, postID=3)
        ]
        
        for like in likes:
            session.add(like)
        session.commit()

        # Add some comments
        comments = [
            CommentInDB(
                userID=JOHN_USER_ID,
                postID=1,
                comment="Love this jacket!"
            ),
            CommentInDB(
                userID=JANE_SELLER_ID,
                postID=1,
                comment="Thanks! It's one of my favorites"
            )
        ]
        
        for comment in comments:
            session.add(comment)
        session.commit()

        # Add following relationships
        following = [
            FollowingInDB(followerID=JOHN_USER_ID, followeeID=JANE_SELLER_ID),
            FollowingInDB(followerID=JOHN_USER_ID, followeeID=BOB_SELLER_ID)
        ]
        
        for follow in following:
            session.add(follow)
        session.commit()

        # Create a link between a post and listing
        links = [
            LinkInDB(listingID=1, postID=2)
        ]
        
        for link in links:
            session.add(link)
        session.commit()

        # Create a chat
        chat = ChatInDB(senderID=JOHN_USER_ID, recipientID=JANE_SELLER_ID)
        session.add(chat)
        session.commit()

        # Add some messages
        messages = [
            MessageInDB(
                chatID=1,
                author=JOHN_USER_ID,
                message="Hi, is the jacket still available?"
            ),
            MessageInDB(
                chatID=1,
                author=JANE_SELLER_ID,
                message="Yes, it is!"
            )
        ]
        
        for message in messages:
            session.add(message)
        session.commit()

        # Add some items to cart
        cart_items = [
            CartInDB(userID=JOHN_USER_ID, listingID=1),
            CartInDB(userID=JOHN_USER_ID, listingID=3)
        ]
        
        for item in cart_items:
            session.add(item)
        session.commit()

        # Create seller stats
        seller_stats = [
            SellerStatInDB(
                sellerID=JANE_SELLER_ID,
                totalEarnings=Decimal("1250.50"),
                itemsSold=5
            ),
            SellerStatInDB(
                sellerID=BOB_SELLER_ID,
                totalEarnings=Decimal("780.25"),
                itemsSold=3
            )
        ]
        
        for stat in seller_stats:
            session.add(stat)
        session.commit()



def clear_database():
    """Clear all data from the database"""
    with engine.connect() as conn:
        conn.execute(text("""
            DROP SCHEMA IF EXISTS public CASCADE;
            CREATE SCHEMA public;
        """))
        conn.commit()

if __name__ == "__main__":
    clear_database()
    seed_database()