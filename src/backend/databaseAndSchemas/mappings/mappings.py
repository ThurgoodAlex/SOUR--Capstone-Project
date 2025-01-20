


from databaseAndSchemas.schema import *


def map_user_db_to_response(user_db: UserInDB) -> User:
    return User(
        firstname=user_db.firstname,
        lastname=user_db.lastname,
        username=user_db.username,
        email=user_db.email,
        id=user_db.id,
        isSeller=user_db.isSeller,
        profilePic=user_db.profilePic or ""
    )
    
def map_link_db_to_response(link_db: LinkInDB) -> Link:
    return Link(
        id= link_db.id,
        listingID = link_db.listingID,
        postID = link_db.postID
    )
