import os
import sys
import boto3
from fastapi import APIRouter, Depends, Query
from datetime import datetime, timezone
from typing import Annotated, Optional
import logging
from sqlalchemy.future import select
from sqlalchemy import desc, text
from jose import JWTError, jwt
from sqlmodel import Session, and_, select
from exceptions import *
from databaseAndSchemas.test_db import get_session
from PRISM.auth import auth_get_current_user
from databaseAndSchemas.mappings.userMapping import *
from exceptions import DuplicateResource, EntityNotFound
from databaseAndSchemas.schema import (
    PostInDB,
    Post,
    UserInDB,
    createPost,
    Delete,
    Link,
    LinkInDB,
    Media,
    MediaInDB,
    createListing,
    Comment,
    CommentCreate,
    Like,
    LikeInDB,
    createMedia,
    Tag,
    TagCreate,
    TagInDB
)


SessionDep = Annotated[Session, Depends(get_session)]

localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')


posts_router = APIRouter(tags=["Posts"])


@posts_router.post('/', response_model= Post, status_code=201)
def upload_post(new_post:createPost,  
                session: Annotated[Session, Depends(get_session)], 
                current_user: UserInDB = Depends(auth_get_current_user)) -> Post:
    """Creating a new posting"""
    
    if not current_user.isSeller:
        raise PermissionDenied("upload", "post")
        
    post = PostInDB(
        **new_post.model_dump(),
        sellerID=current_user.id,
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

related_terms = {
    "sneakers": ["shoes", "kicks", "trainers", "sneaker"],
    "shoes": ["sneakers", "kicks", "trainers", "footwear"],
    "jacket": ["coat", "bomber", "windbreaker", "fleece"],
    "bomber": ["jacket", "coat"],
    "windbreaker": ["jacket", "coat"],
    "sweater": ["pullover", "knit", "cardigan"],
    "jeans": ["pants", "denim"],
    "pants": ["jeans", "trousers", "denim"],
    "tee": ["shirt", "t-shirt"],
    "shirt": ["tee", "t-shirt", "top"]
}

@posts_router.get('/search/', response_model=list[Post], status_code=200)
def fuzzy_search(
    search: str, 
    session: Session = Depends(get_session),
    current_user: UserInDB = Depends(auth_get_current_user)
) -> list[Post]:
    session.execute(text('CREATE EXTENSION IF NOT EXISTS pg_trgm;'))
    session.execute(text('CREATE EXTENSION IF NOT EXISTS unaccent;'))
    session.commit()

    # Include related search terms for better searching
    search_lower = search.lower()
    search_terms = [search_lower]
    if search_lower in related_terms:
        search_terms.extend(related_terms[search_lower])

    # Build tsquery (e.g., "sneakers | shoes | kicks")
    tsquery = ' | '.join(search_terms)

    # query to find related items, 
    # this is a bit confusing and convulated. When support for tags gets included, im gonna try and simplify it.
    query = text("""
        SELECT 
            *, 
            ts_rank(
                to_tsvector('english', unaccent(title || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, ''))),
                to_tsquery('english', :tsquery)
            ) AS rank
        FROM posts
        WHERE 
            to_tsvector('english', unaccent(title || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, ''))) 
            @@ to_tsquery('english', :tsquery)
        ORDER BY 
            rank DESC
        LIMIT 50;
    """)

    results = session.execute(query, {"tsquery": tsquery}).fetchall()
    return results



@posts_router.get('/search/', response_model=list[Post], status_code=200)
def fuzzy_search(
    search: str, 
    session: Session = Depends(get_session),
    current_user: UserInDB = Depends(auth_get_current_user)
) -> list[Post]:
    session.execute(text('CREATE EXTENSION IF NOT EXISTS pg_trgm;'))
    session.execute(text('CREATE EXTENSION IF NOT EXISTS unaccent;'))
    session.commit()

    # Include related search terms for better searching
    search_lower = search.lower()
    search_terms = [search_lower]
    if search_lower in related_terms:
        search_terms.extend(related_terms[search_lower])

    # Build tsquery (e.g., "sneakers | shoes | kicks")
    tsquery = ' | '.join(search_terms)

    # query to find related items, 
    # this is a bit confusing and convulated. When support for tags gets included, im gonna try and simplify it.
    query = text("""
        SELECT 
            *, 
            ts_rank(
                to_tsvector('english', unaccent(title || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, ''))),
                to_tsquery('english', :tsquery)
            ) AS rank
        FROM posts
        WHERE 
            to_tsvector('english', unaccent(title || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, ''))) 
            @@ to_tsquery('english', :tsquery)
        ORDER BY 
            rank DESC
        LIMIT 50;
    """)

    results = session.execute(query, {"tsquery": tsquery}).fetchall()
    return results



@posts_router.get('/search/', response_model=list[Post], status_code=200)
def fuzzy_search(
    search: str, 
    session: Session = Depends(get_session),
    current_user: UserInDB = Depends(auth_get_current_user)
) -> list[Post]:
    session.execute(text('CREATE EXTENSION IF NOT EXISTS pg_trgm;'))
    session.execute(text('CREATE EXTENSION IF NOT EXISTS unaccent;'))
    session.commit()

    # Include related search terms for better searching
    search_lower = search.lower()
    search_terms = [search_lower]
    if search_lower in related_terms:
        search_terms.extend(related_terms[search_lower])

    # Build tsquery (e.g., "sneakers | shoes | kicks")
    tsquery = ' | '.join(search_terms)

    # query to find related items, 
    # this is a bit confusing and convulated. When support for tags gets included, im gonna try and simplify it.
    query = text("""
        SELECT 
            *, 
            ts_rank(
                to_tsvector('english', unaccent(title || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, ''))),
                to_tsquery('english', :tsquery)
            ) AS rank
        FROM posts
        WHERE 
            to_tsvector('english', unaccent(title || ' ' || COALESCE(description, '') || ' ' || COALESCE(brand, ''))) 
            @@ to_tsquery('english', :tsquery)
        ORDER BY 
            rank DESC
        LIMIT 50;
    """)

    results = session.execute(query, {"tsquery": tsquery}).fetchall()
    return results



@posts_router.get('/search/', response_model=list[Post], status_code=200)
def fuzzy_search(search: str, threshold_val: float = 0.3, session: Session = Depends(get_session), 
                current_user: UserInDB = Depends(auth_get_current_user)) -> list[Post]:
    session.execute(text('CREATE EXTENSION IF NOT EXISTS pg_trgm;'))
    session.execute(text('CREATE INDEX IF NOT EXISTS idx_trgm_name ON posts USING gin (title gin_trgm_ops);'))
    
    session.commit()


    # query = text("""
    #     SELECT *, similarity(title, :search) as score
    #     FROM posts
    #     WHERE similarity(title, :search) > :threshold
    #     ORDER BY score DESC;
    # """)

    #We will want to do something like this once we have a basic tag column up.
#     CREATE FUNCTION update_search_vector() RETURNS TRIGGER AS $$
# BEGIN
#   NEW.search_vector := to_tsvector('english', NEW.title);
#   RETURN NEW;
# END;
# $$ LANGUAGE plpgsql;

# CREATE TRIGGER search_vector_update
# BEFORE INSERT OR UPDATE ON posts
# FOR EACH ROW EXECUTE FUNCTION update_search_vector();
    query = text("""
        SELECT *, similarity(title, :search) AS score
        FROM posts
        WHERE (search_vector @@ plainto_tsquery(:search)
        OR similarity(title, :search) > :threshold)
        ORDER BY score DESC;
    """)    
    results = session.execute(query, {"search": search, "threshold": threshold_val}).fetchall()

    return results


@posts_router.post('/listings/', response_model= Post, status_code=201)
def upload_listing(newListing:createListing,  
                session: Annotated[Session, Depends(get_session)], 
                currentUser: UserInDB = Depends(auth_get_current_user)) -> Post:
    """Creating a new posting"""
    
    if not currentUser.isSeller:
        raise PermissionDenied("upload", "listing")
        
    listing = PostInDB(
        **newListing.model_dump(exclude={'price'}),
        price=round(float(newListing.price), 2), 
        sellerID=currentUser.id,
    )
    session.add(listing)
    session.commit()
    session.refresh(listing)
    return listing


@posts_router.get('/', response_model=list[Post])
def get_all_posts(
    session: Annotated[Session, Depends(get_session)], 
    current_user: UserInDB = Depends(auth_get_current_user),
    is_sold: Optional[bool] = Query(None)
) -> list[Post]:
    """Getting all posts"""
    query = select(PostInDB)
    if is_sold is not None:
        query = query.where(PostInDB.isSold == is_sold)
    post_in_db = session.exec(query).all()
    return [Post(**post.model_dump()) for post in post_in_db]

@posts_router.get('/isListing=false/', response_model= list[Post], )
def get_only_posts(session: Annotated[Session, Depends(get_session)], 
                  current_user: UserInDB = Depends(auth_get_current_user)) -> list[Post]:
    """Getting all posts"""
    post_in_db = session.exec(select(PostInDB).where(PostInDB.isListing == False)).all()
    return [Post(**post.model_dump()) for post in post_in_db]

@posts_router.get('/isListing=true/', response_model= list[Post], )
def get_only_listings(session: Annotated[Session, Depends(get_session)], 
                  current_user: UserInDB = Depends(auth_get_current_user)) -> list[Post]:
    """Getting all posts"""
    post_in_db = session.exec(select(PostInDB).where(PostInDB.isListing == True)).all()
    return [Post(**post.model_dump()) for post in post_in_db]


@posts_router.get('/filter/', response_model=list[Post])
def get_filtered_posts(
    size: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    color: Optional[str] = Query(None),
    session: Session = Depends(get_session)
) -> list[Post]:
    """Get posts with dynamic query filters"""
    query = select(PostInDB)
    filters = []

    # Apply filters dynamically if they are provided
    if size:
        filters.append(PostInDB.size == size)
    if brand:
        filters.append(PostInDB.brand == brand)
    if color:
        filters.append(PostInDB.color == color)

    if filters:
        query = query.where(and_(*filters))

    posts_in_db = session.exec(query).all()
    return [Post(**post.model_dump()) for post in posts_in_db]


@posts_router.get('/new', response_model= list[Post], )
def get_newest_posts(session: Annotated[Session, Depends(get_session)], 
                  current_user: UserInDB = Depends(auth_get_current_user)) -> list[Post]:
    """Getting up to the 5 newest posts, ordered from newest to oldest."""
    post_in_db = session.exec(
        select(PostInDB).where(PostInDB.isSold==False).order_by(desc(PostInDB.created_at)).limit(5)
    ).all()
    return [Post(**post.model_dump()) for post in post_in_db]


@posts_router.delete('/comments/{comment_id}/', response_model= Delete, status_code=200)
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


@posts_router.get('/{post_id}/', response_model = Post, status_code=200)
def get_post_by_id(post_id: int, 
                   session: Annotated[Session, Depends(get_session)],
                   current_user: UserInDB = Depends(auth_get_current_user)) -> Post:
    post = session.get(PostInDB, post_id)
    if post:
        return Post(**post.model_dump())
    else:
        raise EntityNotFound("post", post_id)


@posts_router.delete('/{post_id}/', response_model = Delete, status_code=200)
def del_post_by_id(post_id : int, 
                   session: Annotated[Session, Depends(get_session)],
                   current_user: UserInDB = Depends(auth_get_current_user)) -> Delete:
    """Deleting post by id"""
    post = session.get(PostInDB, post_id)
    if not post:
       raise EntityNotFound("Post", post_id)
    if current_user.id != post.sellerID:
        raise PermissionDenied("delete", "post")
    
    session.delete(post)
    session.commit()
    return Delete(message="Post deleted successfully.")






@posts_router.post("/{post_id}/comments/", response_model=Comment, status_code=201)
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


@posts_router.get('/{post_id}/comments/', response_model= list[Comment], status_code=200)
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


@posts_router.get('/comments/{comment_id}/', response_model= Comment, status_code=200)
def get_comment_by_id(session: Annotated[Session, Depends(get_session)],
                    comment_id: int,
                    current_user: UserInDB = Depends(auth_get_current_user))-> Comment:
    """Get comment by id"""
    comment =  session.get(CommentInDB, comment_id)
    if comment:
        return Comment(**comment.model_dump())
    else:
        raise EntityNotFound("comment", comment_id)


@posts_router.post('/{post_id}/link/{listing_id}/', response_model= Link, status_code=201)
def create_new_link(session: Annotated[Session, Depends(get_session)],
                    post_id: int,
                    listing_id: int,
                    current_user: UserInDB = Depends(auth_get_current_user)) -> Link:
    """Creating a new link between a post and a listing"""
    listing = session.get(PostInDB, listing_id)
    post = session.get(PostInDB, post_id)
    if post:
        if listing:
            linkDB = LinkInDB(
                listingID= listing_id,
                postID= post_id
            )
            session.add(linkDB)
            session.commit()
            session.refresh(linkDB)
            return Link(**linkDB.model_dump())
        else:
            raise EntityNotFound("listing", post_id)
    else:
        raise EntityNotFound("post", post_id)
    

    
    
@posts_router.get('/{post_id}/links/', response_model=list[Post], status_code=200)
def get_all_links_by_post_id(session: Annotated[Session, Depends(get_session)],
                             post_id: int,
                             current_user: UserInDB = Depends(auth_get_current_user)) -> list[Post]:
    
    post = session.get(PostInDB, post_id)
    if not post:
        raise EntityNotFound("post", post_id)
    
    if post.isListing:
        links_query = select(LinkInDB).where(LinkInDB.listingID == post_id)
        links_in_db = session.exec(links_query).all()
        post_ids = [link.postID for link in links_in_db]
       
    
    else:
        links_query = select(LinkInDB).where(LinkInDB.postID == post_id)
        links_in_db = session.exec(links_query).all()
        post_ids = [link.listingID for link in links_in_db]
   

    posts_query = select(PostInDB).where(PostInDB.id.in_(post_ids))
    posts = session.exec(posts_query).all()
    
    return [Post(**post.model_dump()) for post in posts]

    

@posts_router.post('/{post_id}/like/', response_model= Like, status_code=201)
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
    
@posts_router.delete('/{post_id}/unlike/', response_model= Delete, status_code=200)
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
@posts_router.get('/{post_id}/like/', response_model= bool, status_code=200)
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
@posts_router.put('/{post_id}/sold/')
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



@posts_router.put('/{post_id}/coverImage')
def add_cover_image(
    post_id: int, 
    cover_image: createMedia,
    session: Annotated[Session, Depends(get_session)]
):
    # Find the post by ID
    post = session.get(PostInDB, post_id)

    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Update the cover image field
    post.coverImage = cover_image.url

    # Save changes
    session.commit()
    session.refresh(post)

    return {
        "message": "Cover image added successfully",
        "post": {
            "id": post.id,
            "coverImage": post.coverImage
        }
    }

@posts_router.post('/{post_id}/media/', response_model=Media,status_code=201)
def upload_media(post_ID: int, 
                 new_media : createMedia, 
                 session: Annotated[Session, Depends(get_session)],
                 current_user: UserInDB = Depends(auth_get_current_user)) -> Media:
    """Uploading new media to a post"""
    post = session.get(PostInDB, post_ID)
    if not post:
        raise EntityNotFound("Post", post_ID)
    mediaDb = MediaInDB(
        **new_media.model_dump(),
        postID=post_ID,
    )
    if current_user.id != post.sellerID:
        raise PermissionDenied("upload", "media")
    session.add(mediaDb)
    session.commit()
    session.refresh(mediaDb)
    return Media(
        id=mediaDb.id,        
        postID=mediaDb.postID,
        **new_media.model_dump()
    )

@posts_router.get('/{post_id}/media/', response_model=list[Media], status_code=200)
def get_media_by_post(post_id: int,
                    session: Annotated[Session, Depends(get_session)], 
                    current_user: UserInDB = Depends(auth_get_current_user)) -> list[Media]:
    """Getting all media for a post"""
    post = session.get(PostInDB, post_id)

    if not post:
        raise EntityNotFound("post", post_id) 
    query = select(MediaInDB).where(MediaInDB.postID == post_id)
    media_in_db = session.exec(query).all()

    return [Media(**media.model_dump()) for media in media_in_db]



@posts_router.post('/{post_id}/tags/', response_model=Tag,status_code=201)
def upload_tag(post_ID: int, 
                 tag : TagCreate, 
                 session: Annotated[Session, Depends(get_session)],
                 current_user: UserInDB = Depends(auth_get_current_user)) -> Tag:
    """Uploading new media to a post"""
    post = session.get(PostInDB, post_ID)
    if not post:
        raise EntityNotFound("Post", post_ID)
    
    tagInDb = TagInDB(
        **tag.model_dump(),
        postID=post_ID,
    )
    
    # if current_user.id != post.sellerID:
    #     raise PermissionDenied("upload", "tag")
    
    
    session.add(tagInDb)
    session.commit()
    session.refresh(tagInDb)
    return Tag(
        id=tagInDb.id,        
        postID=tagInDb.postID,
        tag = tagInDb.tag
    )
    
@posts_router.get('/{post_id}/tags/', response_model=list[Tag], status_code=200)
def get_tags_of_post(post_id: int,
                    session: Annotated[Session, Depends(get_session)], 
                    current_user: UserInDB = Depends(auth_get_current_user)) -> list[Media]:
    """Getting all media for a post"""
    post = session.get(PostInDB, post_id)

    if not post:
        raise EntityNotFound("post", post_id) 
    query = select(TagInDB).where(TagInDB.postID == post_id)
    tags_in_db = session.exec(query).all()

    return [Tag(**tag.model_dump()) for tag in tags_in_db]

