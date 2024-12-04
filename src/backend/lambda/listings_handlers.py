import json

def create_listing_lambda(event, context):
    try:
        new_listing_data = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User created successfully",
                "user": new_listing_data
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
    

def get_all_listings_lambda(event, context):
    try:
        all_listings= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User created successfully",
                "user": all_listings
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

def get_listing_by_user_lambda(event, context):
    try:
        user_listings = json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Listings Retrieved",
                "user": user_listings
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

def get_listing_by_id_lambda(event, context):
    try:
        listing= json.loads(event['body'])  

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Listing Retrieved",
                "user": listing
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }