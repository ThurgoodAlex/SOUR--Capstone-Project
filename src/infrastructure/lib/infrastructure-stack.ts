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

    // upload a post
    const uploadPostLambda = new lambda.Function(this, 'uploadPostLambda',{
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.post_handlers.upload_post',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'upload_post_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    })

    // get all post lambda
    const getAllPostsLambda = new lambda.Function(this, 'GetAllPostsLambda',{
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.post_handlers.get_all_posts_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'get_all_posts_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    })

    // get posts by users lambda
    const getPostsByUserLambda = new lambda.Function(this, 'GetListingsByUserLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.listings_handlers.get_posts_by_user_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_posts_by_user_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
      })

    // get post by id lambda
    const getPostingByIdLambda = new lambda.Function(this, 'GetPostingByIdLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.post_handlers.get_post_by_id_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_post_by_id_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
      })

      const delPostingByIdLambda = new lambda.Function(this, 'DelPostingByIdLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.post_handlers.del_post_by_id_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'del_post_by_id_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
      })

      const getLinksByPostIDLambda = new lambda.Function(this, 'GetLinksByPostID',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.listings_handlers.get_links_by_post_id_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_links_by_post_id_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
    })

    const createLinkLambda = new lambda.Function(this, 'CreateLink',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.listings_handlers.create_link_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'create_link_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
    })

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

      const becomeSellerLambda = new lambda.Function(this, 'BecomeSeller',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.users_handlers.become_seller_lambda',
          code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'become_seller_lambda',
        environment: {
          PYTHONPATH: '/var/task',
        },
      })

    const followUserLambda = new lambda.Function(this, 'FollowUserLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.users_handlers.follow_user_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'follow_user_lambda',
        environment: {
            PYTHONPATH: '/var/task',
        },
    })

    const getFollowersLambda = new lambda.Function(this, 'GetFollowersLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.users_handlers.get_followers_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_followers_lambda',
        environment: {
            PYTHONPATH: '/var/task',
        },
    })

    const getFollowingLambda = new lambda.Function(this, 'GetFollowingLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.users_handlers.get_following_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_following_lambda',
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

      const getMediaByPostLambda = new lambda.Function(this, 'GetMediaByPostLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.media_handlers.get_media_by_post_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'get_media_by_post_lambda',
        environment: {
        PYTHONPATH: '/var/task',
        },
      })

      const delMediaByIDLambda = new lambda.Function(this, 'DelMediaByIDLambda',{
        runtime: lambda.Runtime.PYTHON_3_8,
        handler: 'lambda.media_handlers.del_media_by_id_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
        functionName: 'del_media_by_id_lambda',
        environment: {
        PYTHONPATH: '/var/task',
        },
      })



    // Chats and Messages Lambdas

    // creating a chat
    const createChatLambda = new lambda.Function(this, 'CreateChatLambda',{
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.chats_handlers.upload_chat_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'upload_chat_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    })

    // get all Chats of user lambda
    const getChatsOfUserLambda = new lambda.Function(this, 'GetChatsOfUserLambda',{
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.chats_handlers.get_all_users_chats_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'get_all_users_chats_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    })


    // creating a message
    const createMessageLambda = new lambda.Function(this, 'CreateMessageLambda',{
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.chats_handlers.upload_message_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'upload_message_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    })

    // get all messages of chat lambda
    const getMessagesOfChatLambda = new lambda.Function(this, 'GetMessagesOfChatLambda',{
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'lambda.chats_handlers.get_messages_of_chat_lambda',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
      functionName: 'get_messages_of_chat_lambda',
      environment: {
        PYTHONPATH: '/var/task',
      },
    })

    //Here is the intergration to API gateway.

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'StarterPageApi', {
      restApiName: 'Starter Page API',
      description: 'This service serves the starter page content.',
    });

    // Create Lambda integration
    const starterPageIntegration = new apigateway.LambdaIntegration(starterPageLambda);

    // Auth
    const createUserIntergration = new apigateway.LambdaIntegration(createUserLambda);
    const loginUserIntergration = new apigateway.LambdaIntegration(loginUserLambda);


    const uploadPostIntergration = new apigateway.LambdaIntegration(uploadPostLambda);
    const getAllPostsIntergration = new apigateway.LambdaIntegration(getAllPostsLambda);
    const getPostsByUserIntergration = new apigateway.LambdaIntegration(getPostsByUserLambda);
    const getPostByIdIntergration = new apigateway.LambdaIntegration(getPostingByIdLambda);
    const delPostByIdIntergration = new apigateway.LambdaIntegration(delPostingByIdLambda);

    const getAcessTokenIntergration = new apigateway.LambdaIntegration(getAccessTokenLambda);
    const getCurrentUserIntergration = new apigateway.LambdaIntegration(getCurrentUserLambda);
 
    const uploadMediaIntergration = new apigateway.LambdaIntegration(uploadMediaLambda);
    const getAllMediaIntergration = new apigateway.LambdaIntegration(getAllMediaLambda);
    const getMediaByIDIntergration = new apigateway.LambdaIntegration(getMediaByIDLambda);
    const getMediaByPostIntergration = new apigateway.LambdaIntegration(getMediaByPostLambda);
    const delMediaByIDIntergration = new apigateway.LambdaIntegration(delMediaByIDLambda)

    const getLinksByPostIdIntegration = new apigateway.LambdaIntegration(getLinksByPostIDLambda);
    const createLinkIntegration = new apigateway.LambdaIntegration(createLinkLambda);

    // Users
    const getAllUsersIntergration = new apigateway.LambdaIntegration(getAllUsersLambda);
    const getUserByIdIntergration = new apigateway.LambdaIntegration(getUserByIdLambda);
    const becomeSellerIntegration = new apigateway.LambdaIntegration(becomeSellerLambda)
    const followUserIntegration = new apigateway.LambdaIntegration(followUserLambda);
    const getFollowersIntegration = new apigateway.LambdaIntegration(getFollowersLambda);
    const getFollowingIntegration = new apigateway.LambdaIntegration(getFollowingLambda);

    // Chats & Messages
    const createChatIntegration = new apigateway.LambdaIntegration(createChatLambda);
    const getChatsOfUserIntegration = new apigateway.LambdaIntegration(getChatsOfUserLambda);
    const createMessageIntegration = new apigateway.LambdaIntegration(createMessageLambda);
    const getMessagesOfChatIntegration = new apigateway.LambdaIntegration(getMessagesOfChatLambda);


    api.root.addMethod('GET', starterPageIntegration);


    // Adding Create user route from Auth
    const createUserResource = api.root.addResource('createuser');
    createUserResource.addMethod('POST', createUserIntergration);

    // Adding login user route from Auth
    const loginUserResource = api.root.addResource('loginuser')
    loginUserResource.addMethod('POST', loginUserIntergration)

    // adding get access token route from auth
    const getAccessTokenResource = api.root.addResource('getaccesstoken')
    getAccessTokenResource.addMethod('POST', getAcessTokenIntergration)

    // adding get current user route from auth
    const getCurrentUserResource = api.root.addResource('getcurrentuser')
    getCurrentUserResource.addMethod('GET', getCurrentUserIntergration)

    const becomeSellerResource = api.root.addResource('becomeseller')
    getCurrentUserResource.addMethod('PUT', becomeSellerIntegration)

   //post endpoints
    const uploadPostResource = api.root.addResource('uploadPost');
    uploadPostResource.addMethod('POST', uploadPostIntergration)

    const getAllPostsResource = api.root.addResource('getAllPosts');
    getAllPostsResource.addMethod('GET', getAllPostsIntergration);

    const getPostsByUserResource = api.root.addResource('getPostsByUser');
    getPostsByUserResource.addMethod('GET', getPostsByUserIntergration);

    const getPostByIdResource = api.root.addResource('getPostById');
    getPostByIdResource.addMethod('GET', getPostByIdIntergration);


    const delPostByIdResource = api.root.addResource('delPostById');
    delPostByIdResource.addMethod('DELETE', delPostByIdIntergration);

    const getLinksByPostIdResouce = api.root.addResource('getLinksByPostId');
    getLinksByPostIdResouce.addMethod('GET', getLinksByPostIdIntegration);

    const createLinkResource = api.root.addResource('createLink');
    createLinkResource.addMethod('POST', createLinkIntegration);

    const getAllUsersResource = api.root.addResource('getAllUsers');
    getAllUsersResource.addMethod('GET', getAllUsersIntergration);

    const getUsersByIdResource = api.root.addResource('getUserById');
    getUsersByIdResource.addMethod('GET', getUserByIdIntergration);

    const followUserResource = api.root.addResource('followUser');
    followUserResource.addMethod('POST', followUserIntegration);

    const getFollowersResource = api.root.addResource('getFollowers');
    getFollowersResource.addMethod('GET', getFollowersIntegration);

    const getFollowingResource = api.root.addResource('getFollowing');
    getFollowingResource.addMethod('GET', getFollowingIntegration);

    //Media endpoints
    const uploadMediaResource = api.root.addResource('uploadMedia');
    uploadMediaResource.addMethod('POST', uploadMediaIntergration)

    const getAllMediaResource = api.root.addResource('getAllMedia');
    getAllMediaResource.addMethod('GET', getAllMediaIntergration)

    const getMediaByIDResource = api.root.addResource('getMediaByID');
    getMediaByIDResource.addMethod('GET', getMediaByIDIntergration)

    const getMediaByPostResource = api.root.addResource('getMediaByPost');
    getMediaByPostResource.addMethod('GET', getMediaByPostIntergration)

    const delMediaByIDResource = api.root.addResource('delMediaByID');
    delMediaByIDResource.addMethod('DELETE', delMediaByIDIntergration)

    const uploadChatResource = api.root.addResource('uploadChat');
    uploadChatResource.addMethod('POST', createChatIntegration)

    const uploadMessageResource = api.root.addResource('uploadMessage');
    uploadMessageResource.addMethod('POST', createMessageIntegration)

    const getChatsOfUserResource = api.root.addResource('getChatsOfUser');
    getChatsOfUserResource.addMethod('GET', getChatsOfUserIntegration)

    const getMessagesOfChat = api.root.addResource('getMessagesOfChat');
    getMessagesOfChat.addMethod('GET', getMessagesOfChatIntegration)


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
