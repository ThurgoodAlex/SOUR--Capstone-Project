import os
import sys
import json
import boto3
import logging 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from contextlib import asynccontextmanager
from fastapi.openapi.utils import get_openapi
from databaseAndSchemas import * 
from PRISM import (
    auth_router,
    users_router
)
from SOCIAL import (
    chats_router,
    posts_router,
    media_router,
    tags_router
)
from LOTUS import stripe_router


@asynccontextmanager
async def lifespan(app:FastAPI):
    create_db_and_tables()
    yield 


app = FastAPI(lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/auth")
app.include_router(stripe_router, prefix="/stripe")
app.include_router(users_router, prefix="/users")
app.include_router(posts_router, prefix="/posts")
app.include_router(media_router, prefix="/media")
app.include_router(tags_router, prefix="/tags")
app.include_router(chats_router, prefix="/chats")

# Configure boto3 to use LocalStack
localstack_endpoint = os.environ.get('LOCALSTACK_ENDPOINT', 'http://localstack:4566')
lambda_client = boto3.client('lambda', endpoint_url=localstack_endpoint, 
                             region_name='us-west-1',  # match with CDK stack region
                             aws_access_key_id='test',
                             aws_secret_access_key='test')
@app.get("/")
async def root():
    try:
        # Invoke the Lambda function
        response = lambda_client.invoke(
            FunctionName='starter_page_lambda',
            InvocationType='RequestResponse'
        )
        # Parse the Lambda response
        return json.loads(response['Payload'].read())
    except Exception as e:
        return {"error": str(e)}

@app.get("/health/")
async def health():
    return {"status": "healthy"}

app.openapi = lambda: get_openapi(
    title="Sour API",
    version="1.0.0",
    description="Sours API",
    routes=app.routes
)