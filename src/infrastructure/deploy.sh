#!/bin/bash
set -e

export NODE_PATH=/usr/lib/node_modules

# Change to infrastructure directory

cd /app/src/infrastructure

echo "working directory set to $(pwd)" 

# Bootstrap CDK local environment
npx cdklocal bootstrap

echo "deploying changes" 
# Deploy without approval prompt
npx cdklocal deploy S3BucketStack --require-approval never
# npx aws-cdk-local deploy S3BucketStack --require-approval never --output ./cdk.out.deploy