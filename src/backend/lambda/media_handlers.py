import json

def upload_media_lambda(event, context):
    try:
        new_media_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Media uploaded succesfully",
                "media": new_media_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    
def get_all_media_lambda(event, context):
    try:
        media_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Media retrieved successfully",
                "media": media_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

def get_media_by_post_lambda(event, context):
    try:
        media_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Media retrieved successfully",
                "media": media_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    


def get_media_by_id_lambda(event, context):
    try:
        media_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Media retrieved successfully",
                "media": media_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


def del_media_by_id_lambda(event, context):
    try:
        media= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Media deleted",
                "media": media
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
