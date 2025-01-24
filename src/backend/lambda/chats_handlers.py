import json


def upload_chat_lambda(event, context):
    try:
        new_chat_data = json.loads(event['body'])  

        return {
            "statusCode": 201,
            "body": json.dumps({
                "message": "Chat created successfully",
                "chat": new_chat_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


def get_all_users_chats_lambda(event, context):
    try:
        all_chats= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "chats retrived successfully",
                "chats": all_chats
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


def upload_message_lambda(event, context):
    try:
        new_message_data = json.loads(event['body'])  

        return {
            "statusCode": 201,
            "body": json.dumps({
                "message": "Chat created successfully",
                "uploaded_message": new_message_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }



def get_messages_of_chat_lambda(event, context):
    try:
        all_messages= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "messages retrieved",
                "messages": all_messages
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

