import json

def get_all_users_lambda(event, context):
    try:
        all_users= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Users retrived successfully",
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
                "message": "User stats Retrieved",
                "user": user
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }