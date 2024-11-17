import json
import logging
from PRISM.src.prism_services.auth import create_new_user

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/lambda_create_user.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)


# this is taken from ChatGPT... The logger is not being hit, 
# also a session needs to be created. How would this happen?
def create_user_lambda(event, context):
    try:
        # The event contains the incoming request data (for example, from API Gateway)
        # You might need to process the event to pass the right data to the function
        new_user_data = json.loads(event['body'])  # Extracting the data from the API Gateway request body
        logger.info(new_user_data)

        # Call your function, passing the new user data (you may need to adapt it to your function)
        response = create_new_user(new_user_data)
        logger.info(response)

        # Return a response back to the API Gateway
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "User created successfully",
                "user": response
            })
        }

    except Exception as e:
        # Handle any exceptions that occur and return an error response
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }