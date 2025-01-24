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

def map_comment_db_to_comment(comment_db: CommentInDB) -> Comment:
    return Comment(
        userID=comment_db.userID,
        postID=comment_db.postID,
        comment=comment_db.comment
    )
def map_following_db_to_response(following_db: FollowingInDB) -> Following:
    return Following(
        id=following_db.id,
        followerID=following_db.followerID,
        followeeID=following_db.followeeID
    )


    
def map_link_db_to_response(link_db: LinkInDB) -> Link:
    return Link(
        id= link_db.id,
        listingID = link_db.listingID,
        postID = link_db.postID
    )
