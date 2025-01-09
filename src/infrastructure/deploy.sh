#!/bin/bash
# Change to infrastructure directory
echo "switching to infrastructure directory" 

cd infrastructure 

echo "bootstrapping.." 

# Bootstrap CDK local environment
npx cdklocal bootstrap

echo "deploying changes" 
# Deploy without approval prompt
npx cdklocal deploy --require-approval never

