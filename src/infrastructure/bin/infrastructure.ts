#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendInfrastructureStack } from '../lib/infrastructure-stack';

const app = new cdk.App();

const localStackEndpoint = process.env.LOCALSTACK_HOSTNAME 
  ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` 
  : 'http://localhost:4566';

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || '000000000000',
  region: process.env.CDK_DEFAULT_REGION || 'us-west-1'
};

new BackendInfrastructureStack(app, 'BackendInfrastructureStack', { env });

app.synth();
