import json

def upload_post(event, context):
    try:
        new_post_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "post sucessfully uploaded",
                "post": new_post_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

def get_all_posts_lambda(event, context):
    try:
        all_listings= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "posts succesfully retrieved",
                "posts": all_listings
            })
        }
    
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

def get_newest_posts_lambda(event, context):
    try:
        newest_listings= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "posts succesfully retrieved",
                "posts": newest_listings
            })
        }
    
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }



def get_posts_by_user_lambda(event, context):
    try:
        user_listings = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Listings Retrieved",
                "posts": user_listings
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

def get_post_by_id_lambda(event, context):
    try:
        post= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Post Retrieved",
                "post": post
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


def del_post_by_id_lambda(event, context):
    try:
        post= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Post deleted",
                "post": post
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


def post_sold_lambda(event, context):
    try:
        post= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Post sold",
                "post": post
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

