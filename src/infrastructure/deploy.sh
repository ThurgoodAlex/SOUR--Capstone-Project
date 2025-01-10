#!/bin/bash
set -e

export NODE_PATH=/usr/lib/node_modules

# Change to infrastructure directory
echo "switching to infrastructure directory" 


echo "Checking AWS credentials..."
aws configure list
aws sts get-caller-identity

echo "bootstrapping.." 

# Bootstrap CDK local environment
npx aws-cdk-local bootstrap

echo "deploying changes" 
# Deploy without approval prompt
npx  aws-cdk-local deploy --require-approval never
