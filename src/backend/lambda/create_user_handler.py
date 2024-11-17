import json
import logging
from PRISM.src.prism_services.auth import create_new_user

def create_user_lambda(event, context):
    try:

        new_user_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User created successfully",
                "user": new_user_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }