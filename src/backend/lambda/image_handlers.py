import json

def upload_image_lambda(event, context):
    try:
        new_image_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User created successfully",
                "user": new_image_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    
def get_all_images_lambda(event, context):
    try:
        image_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User created successfully",
                "user": image_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

def get_image_by_id_lambda(event, context):
    try:
        image_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User created successfully",
                "user": image_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    


def get_image_by_user_lambda(event, context):
    try:
        image_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User created successfully",
                "user": image_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    