import json

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
    
def login_user_lambda(event, context):
    try:
        login_user = json.loads(event['body'])

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User logged in correctly",
                "user": login_user

            })

        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

def get_access_token_lambda(event, context):
    try:
        access_token = json.loads(event['body'])

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User logged in correctly",
                "user": access_token

            })

        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

def get_current_user_lambda(event, context):
    try:
        access_token = json.loads(event['body'])

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User logged in correctly",
                "user": access_token

            })

        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }