import json

def get_all_users_lambda(event, context):
    try:
        all_users= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Users Retrived Successfully",
                "users": all_users
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

def get_user_by_id_lambda(event, context):
    try:
        user= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User Retrieved",
                "user": user
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

def get_user_stats_lambda(event, context):
    try:
        user= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User Stats Retrieved",
                "user": user
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    
def add_item_to_cart(event, context):
    try:
        item= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Item Added Successfully",
                "item": item
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

def get_user_cart(event, context):
    try:
        cart= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User Cart Retrieved",
                "user": cart
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

def del_item_from_cart(event, context):
    try:
        item= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Item Removed From Cart",
                "item": item
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }