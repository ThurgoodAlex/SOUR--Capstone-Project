import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class BackendInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const starterPageLambdaPath = path.join(__dirname, '../../backend/')
    // Create Lambda function
    const starterPageLambda = new lambda.Function(this, 'StarterPageLambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.starter_page.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'starter_page_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    });

    const createUserLambdaPath = path.join(__dirname, '../../backend/')
    // Create Lambda function
    const createUserLambda = new lambda.Function(this, 'CreateUserLambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.create_user_handler.create_user_lambda',
       code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'create_user_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    });


    // Create API Gateway
    const api = new apigateway.RestApi(this, 'StarterPageApi', {
      restApiName: 'Starter Page API',
      description: 'This service serves the starter page content.',
    });

    // Create Lambda integration
    const starterPageIntegration = new apigateway.LambdaIntegration(starterPageLambda);
    const createUserIntergration = new apigateway.LambdaIntegration(createUserLambda);

    // Add root resource and method
    api.root.addMethod('GET', starterPageIntegration);
    // Adding Create user route from Auth
    const createUserResource = api.root.addResource('createuser');
    createUserResource.addMethod('POST', createUserIntergration);

    // Add /health endpoint
    const healthResource = api.root.addResource('health');
    healthResource.addMethod('GET', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': '{"status": "healthy"}',
        },
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }), {
      methodResponses: [{ statusCode: '200' }],
    });

    // Output the API Gateway URL
    new cdk.CfnOutput(this, 'ApiGatewayUrl', {
      value: api.url,
      description: 'URL of the API Gateway',
    });

    // Output the Lambda function name
    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: starterPageLambda.functionName,
      description: 'Name of the Lambda function',
    });
  }
}
