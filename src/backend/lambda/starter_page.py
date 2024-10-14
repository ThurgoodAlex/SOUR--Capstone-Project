import json
def lambda_handler(event, context):
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Welcome to the Starter Page!",
            "info": "This content is served by a Lambda function through FastAPI and LocalStack."
        })
    }
