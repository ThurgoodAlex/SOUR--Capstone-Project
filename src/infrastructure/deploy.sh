#!/bin/bash

# Change to infrastructure directory
echo "switching to infrastructure directory" 

cd infrastructure 

echo "bootstrapping.." 

# Bootstrap CDK local environment
npx aws-cdk-local bootstrap

echo "deploying changes" 
# Deploy without approval prompt
npx aws-cdk-local deploy --require-approval never
