import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export class BackendInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //here is a boiler code template for Lambda path code.

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


    // Here are the PRISM lambdas

    // Create Lambda function
    const createUserLambda = new lambda.Function(this, 'CreateUserLambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.auth_handlers.create_user_lambda',
       code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'create_user_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    });

    // login Lambda function
    const loginUserLambda = new lambda.Function(this, 'LoginUserLambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.auth_handlers.login_user_lambda',
       code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'login_user_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    });

    // Get Access Token Lambda
    const getAccessTokenLambda = new lambda.Function(this, 'getAccessTokenLambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.auth_handlers.get_access_token_lambda',
       code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'get_access_token_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    });


      // Get current user Lambda
      const getCurrentUserLambda = new lambda.Function(this, 'getCurrentUserLambda', {
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.auth_handlers.get_current_user_lambda',
         code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_current_user_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
      });

    // creating a listing
    const createListingLambda = new lambda.Function(this, 'CreateListingLambda',{
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.listings_handlers.create_new_listing',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'create_listing_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    })

    // get all listings lambda
    const getAllListingsLambda = new lambda.Function(this, 'GetAllListingsLambda',{
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.listings_handlers.get_all_listings_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'get_all_listings_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    })

    // get listings by users lambda
    const getListingsByUserLambda = new lambda.Function(this, 'GetListingsByUserLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.listings_handlers.get_listings_by_user_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_listings_by_user_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
      })

    // get listing by id lambda
    const getListingByIdLambda = new lambda.Function(this, 'GetListingByIdLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.listings_handlers.get_listing_by_id_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_listing_by_id_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
      })

      // get all users lambda
    const getAllUsersLambda = new lambda.Function(this, 'GetAllUsersLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.users_handlers.get_all_users_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_all_users_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
      })

      // get user by id lambda
    const getUserByIdLambda = new lambda.Function(this, 'GetUserByIdLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.users_handlers.get_user_by_id_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_user_by_id_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
      })


      //upload media lambda
    const uploadMediaLambda = new lambda.Function(this, 'UploadMediaLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.media_handlers.upload_media_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'upload_media_lambda',
        environment: {
        PYTHONPATH: '/var/task',
        },
      })

      const getAllMediaLambda = new lambda.Function(this, 'GetAllMediaLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.media_handlers.get_all_media_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_all_media_lambda',
        environment: {
        PYTHONPATH: '/var/task',
        },
      })

      const getMediaByIDLambda = new lambda.Function(this, 'GetMediaByIDLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.media_handlers.get_media_by_id_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_media_by_id_lambda',
        environment: {
        PYTHONPATH: '/var/task',
        },
      })

      const getMediaByUserLambda = new lambda.Function(this, 'GetMediaByUserLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.media_handlers.get_media_by_user_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_media_by_user_lambda',
        environment: {
        PYTHONPATH: '/var/task',
        },
      })

      const getCommentByIDLambda = new lambda.Function(this, 'getCommentByIDLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.media_handlers.get_comment_by_id_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_comment_by_id_lambda',
        environment: {
        PYTHONPATH: '/var/task',
        },
      })

      const getCommentsByPostIDLambda = new lambda.Function(this, 'GetCommentsByPostIDLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.media_handlers.get_all_comments_by_post_id_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_all_comments_by_post_id_lambda',
        environment: {
        PYTHONPATH: '/var/task',
        },
      })

      const createCommentLambda = new lambda.Function(this, 'createCommentLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.media_handlers.create_new_comment_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'create_new_comment_lambda',
        environment: {
        PYTHONPATH: '/var/task',
        },
      })


    //Here is the Integration to API gateway.

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'StarterPageApi', {
      restApiName: 'Starter Page API',
      description: 'This service serves the starter page content.',
    });

    // Create Lambda integration
    const starterPageIntegration = new apigateway.LambdaIntegration(starterPageLambda);
    const createUserIntegration = new apigateway.LambdaIntegration(createUserLambda);
    const loginUserIntegration = new apigateway.LambdaIntegration(loginUserLambda);
    const createListingIntegration = new apigateway.LambdaIntegration(createListingLambda);
    const getAcessTokenIntegration = new apigateway.LambdaIntegration(getAccessTokenLambda);
    const getCurrentUserIntegration = new apigateway.LambdaIntegration(getCurrentUserLambda);
    const getAllListingsIntegration = new apigateway.LambdaIntegration(getAllListingsLambda);
    const getListingsByUserIntegration = new apigateway.LambdaIntegration(getListingsByUserLambda);
    const getListingByIdIntegration = new apigateway.LambdaIntegration(getListingByIdLambda);
    const uploadMediaIntegration = new apigateway.LambdaIntegration(uploadMediaLambda);
    const getAllMediaIntegration = new apigateway.LambdaIntegration(getAllMediaLambda);
    const getMediaByIDIntegration = new apigateway.LambdaIntegration(getMediaByIDLambda);
    const getMediaByUserIntegration = new apigateway.LambdaIntegration(getMediaByUserLambda);
    const getAllUsersIntegration = new apigateway.LambdaIntegration(getAllUsersLambda);
    const getUserByIdIntegration = new apigateway.LambdaIntegration(getUserByIdLambda);
    const getCommentByIDIntegration = new apigateway.LambdaIntegration(getCommentByIDLambda);
    const getCommentsByPostIDIntegration = new apigateway.LambdaIntegration(getCommentsByPostIDLambda);
    const createCommentIntegration = new apigateway.LambdaIntegration(createCommentLambda);



    api.root.addMethod('GET', starterPageIntegration);


    // Adding Create user route from Auth
    const createUserResource = api.root.addResource('createuser');
    createUserResource.addMethod('POST', createUserIntegration);

    // Adding login user route from Auth
    const loginUserResource = api.root.addResource('loginuser')
    loginUserResource.addMethod('POST', loginUserIntegration)

    // adding get access token route from auth
    const getAccessTokenResource = api.root.addResource('getaccesstoken')
    getAccessTokenResource.addMethod('POST', getAcessTokenIntegration)

    // adding get current user route from auth
    const getCurrentUserResource = api.root.addResource('getcurrentuser')
    getCurrentUserResource.addMethod('GET', getCurrentUserIntegration)

    //Adding Listing endpoints
    const createListingResource = api.root.addResource('createlisting');
    createListingResource.addMethod('POST', createListingIntegration)

    const getAllListingsResource = api.root.addResource('getAllListings');
    getAllListingsResource.addMethod('GET', getAllListingsIntegration);

    const getListingsByUserResource = api.root.addResource('getListingsByUser');
    getListingsByUserResource.addMethod('GET', getListingsByUserIntegration);

    const getListingByIdResource = api.root.addResource('getListingById');
    getListingByIdResource.addMethod('GET', getListingByIdIntegration);

    const getAllUsersResource = api.root.addResource('getAllUsers');
    getAllUsersResource.addMethod('GET', getAllUsersIntegration);

    const getUsersByIdResource = api.root.addResource('getUserById');
    getUsersByIdResource.addMethod('GET', getUserByIdIntegration);


    const uploadMediaResource = api.root.addResource('uploadMedia');
    uploadMediaResource.addMethod('POST', uploadMediaIntegration)

    const getAllMediaResource = api.root.addResource('getAllMedia');
    getAllMediaResource.addMethod('GET', getAllMediaIntegration)

    const getMediaByIDResource = api.root.addResource('getMediaByID');
    getMediaByIDResource.addMethod('GET', getMediaByIDIntegration)

    const getMediaByUserResource = api.root.addResource('getMediaByUser');
    getMediaByUserResource.addMethod('GET', getMediaByUserIntegration)

    const getCommentByIDResource = api.root.addResource('getCommentByID');
    getCommentByIDResource.addMethod('GET', getCommentByIDIntegration)
    
    const getCommentsByPostIDResource = api.root.addResource('getCommentsByPostID');
    getCommentsByPostIDResource.addMethod('GET', getCommentsByPostIDIntegration)

    const createCommentResource = api.root.addResource('createComment');
    createCommentResource.addMethod('GET', createCommentIntegration)

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
