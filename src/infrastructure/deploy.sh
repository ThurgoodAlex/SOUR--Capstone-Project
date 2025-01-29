#!/bin/bash
set -e

export NODE_PATH=/usr/lib/node_modules

# Change to infrastructure directory
echo "working directory set to $(pwd)" 

npm install 

npm list 

npm run build

# Bootstrap CDK local environment
npx aws-cdk-local bootstrap

echo "deploying changes" 

# Deploy without approval prompt

npx aws-cdk-local deploy --require-approval never --output ./cdk.out.deploy