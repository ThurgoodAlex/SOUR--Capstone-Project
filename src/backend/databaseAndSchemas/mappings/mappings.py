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
    
    
