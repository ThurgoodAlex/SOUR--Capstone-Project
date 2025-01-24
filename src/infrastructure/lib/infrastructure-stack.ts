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
        const uploadPostLambda = new lambda.Function(this, 'uploadPostLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.post_handlers.upload_post',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'upload_post_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        // upload a post
        const uploadListingLambda = new lambda.Function(this, 'uploadListingLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.post_handlers.upload_listing',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'upload_listing',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        // get all post lambda
        const getAllPostsLambda = new lambda.Function(this, 'GetAllPostsLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.post_handlers.get_all_posts_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_all_posts_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        // get posts by users lambda
        const getPostsByUserLambda = new lambda.Function(this, 'GetListingsByUserLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.listings_handlers.get_posts_by_user_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_posts_by_user_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        // get post by id lambda
        const getPostingByIdLambda = new lambda.Function(this, 'GetPostingByIdLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.post_handlers.get_post_by_id_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_post_by_id_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const delPostingByIdLambda = new lambda.Function(this, 'DelPostingByIdLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.post_handlers.del_post_by_id_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'del_post_by_id_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const postSoldLambda = new lambda.Function(this, 'PostSoldLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.post_handlers.post_sold_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'post_sold_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getLinksByPostIDLambda = new lambda.Function(this, 'GetLinksByPostID', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.listings_handlers.get_links_by_post_id_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_links_by_post_id_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const likePostLambda = new lambda.Function(this, 'LikePost', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.post_handlers.like_post',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'like_post',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const unlikePostLambda = new lambda.Function(this, 'UnlikePost', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.post_handlers.unlike_post',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'unlike_post',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getLikeLambda = new lambda.Function(this, 'getLikeLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.post_handlers.get_like_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_like_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const createLinkLambda = new lambda.Function(this, 'CreateLink', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.listings_handlers.create_link_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'create_link_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getAllUsersLambda = new lambda.Function(this, 'GetAllUsersLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.users_handlers.get_all_users_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_all_users_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        // get user by id lambda
        const getUserByIdLambda = new lambda.Function(this, 'GetUserByIdLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.users_handlers.get_user_by_id_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_user_by_id_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const becomeSellerLambda = new lambda.Function(this, 'BecomeSeller', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.users_handlers.become_seller_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'become_seller_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const followUserLambda = new lambda.Function(this, 'FollowUserLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.users_handlers.follow_user_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'follow_user_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });


        const getUserStatsLambda = new lambda.Function(this, 'GetUserStatsLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.users_handlers.get_user_stats_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_user_stats_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const unfollowUserLambda = new lambda.Function(this, 'UnfollowUserLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.users_handlers.unfollow_user_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'unfollow_user_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getFollowersLambda = new lambda.Function(this, 'GetFollowersLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.users_handlers.get_followers_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_followers_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getFollowingLambda = new lambda.Function(this, 'GetFollowingLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.users_handlers.get_following_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_following_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });


        //upload media lambda
        const uploadMediaLambda = new lambda.Function(this, 'UploadMediaLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.media_handlers.upload_media_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'upload_media_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getAllMediaLambda = new lambda.Function(this, 'GetAllMediaLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.media_handlers.get_all_media_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_all_media_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getMediaByIDLambda = new lambda.Function(this, 'GetMediaByIDLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.media_handlers.get_media_by_id_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_media_by_id_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getMediaByPostLambda = new lambda.Function(this, 'GetMediaByPostLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.media_handlers.get_media_by_post_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_media_by_post_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getCommentByIDLambda = new lambda.Function(this, 'getCommentByIDLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.media_handlers.get_comment_by_id_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_comment_by_id_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getCommentsByPostIDLambda = new lambda.Function(this, 'GetCommentsByPostIDLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.media_handlers.get_all_comments_by_post_id_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_all_comments_by_post_id_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const createCommentLambda = new lambda.Function(this, 'createCommentLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.media_handlers.create_new_comment_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'create_new_comment_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const delCommentLambda = new lambda.Function(this, 'delCommentLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.media_handlers.del_comment_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'del_comment_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const delMediaByIDLambda = new lambda.Function(this, 'DelMediaByIDLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.media_handlers.del_media_by_id_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'del_media_by_id_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });


        // Chats and Messages Lambdas

        // creating a chat
        const createChatLambda = new lambda.Function(this, 'CreateChatLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.chats_handlers.upload_chat_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'upload_chat_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        // get all Chats of user lambda
        const getChatsOfUserLambda = new lambda.Function(this, 'GetChatsOfUserLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.chats_handlers.get_all_users_chats_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_all_users_chats_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        // creating a message
        const createMessageLambda = new lambda.Function(this, 'CreateMessageLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.chats_handlers.upload_message_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'upload_message_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        // get all messages of chat lambda
        const getMessagesOfChatLambda = new lambda.Function(this, 'GetMessagesOfChatLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.chats_handlers.get_messages_of_chat_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_messages_of_chat_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const getUserCartLambda = new lambda.Function(this, 'GetUserCartLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.user_handlers.get_user_cart_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'get_user_cart_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const addItemToCartLambda = new lambda.Function(this, 'AddItemToCartLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.user_handlers.add_item_to_cart_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'add_item_to_cart_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        const delItemFromCartLambda = new lambda.Function(this, 'DellItemFromCartLambda', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'lambda.user_handlers.del_item_from_cart_lambda',
            code: lambda.Code.fromAsset(path.join(__dirname, '../../backend')),
            functionName: 'del_item_from_cart_lambda',
            environment: {
                PYTHONPATH: '/var/task',
            },
        });

        //Here is the intergration to API gateway.
        // Create API Gateway
        const api = new apigateway.RestApi(this, 'StarterPageApi', {
            restApiName: 'Starter Page API',
            description: 'This service serves the starter page content.',
        });

        // Create Lambda integration
        const starterPageIntegration = new apigateway.LambdaIntegration(starterPageLambda);

        // Auth
        const createUserIntegration = new apigateway.LambdaIntegration(createUserLambda);
        const loginUserIntegration = new apigateway.LambdaIntegration(loginUserLambda);
        const getCurrentUserIntegration = new apigateway.LambdaIntegration(getCurrentUserLambda);
        const getAcessTokenIntegration = new apigateway.LambdaIntegration(getAccessTokenLambda);

        // Posts
        const postSoldIntergration = new apigateway.LambdaIntegration(postSoldLambda);
        const uploadPostIntegration = new apigateway.LambdaIntegration(uploadPostLambda);
        const uploadListingIntegration = new apigateway.LambdaIntegration(uploadListingLambda);
        const getAllPostsIntegration = new apigateway.LambdaIntegration(getAllPostsLambda);
        const getPostsByUserIntegration = new apigateway.LambdaIntegration(getPostsByUserLambda);
        const getPostByIdIntegration = new apigateway.LambdaIntegration(getPostingByIdLambda);
        const delPostByIdIntegration = new apigateway.LambdaIntegration(delPostingByIdLambda);
        const getCommentByIDIntegration = new apigateway.LambdaIntegration(getCommentByIDLambda);
        const getCommentsByPostIDIntegration = new apigateway.LambdaIntegration(getCommentsByPostIDLambda);
        const createCommentIntegration = new apigateway.LambdaIntegration(createCommentLambda);
        const delCommentIntegration = new apigateway.LambdaIntegration(delCommentLambda);
        const likePostIntegration = new apigateway.LambdaIntegration(likePostLambda);
        const unlikePostIntegration = new apigateway.LambdaIntegration(unlikePostLambda);
        const getLikeIntegration = new apigateway.LambdaIntegration(getLikeLambda);
        const uploadMediaIntegration = new apigateway.LambdaIntegration(uploadMediaLambda);
        const getAllMediaIntegration = new apigateway.LambdaIntegration(getAllMediaLambda);
        const getMediaByIDIntegration = new apigateway.LambdaIntegration(getMediaByIDLambda);
        const getMediaByPostIntegration = new apigateway.LambdaIntegration(getMediaByPostLambda);
        const delMediaByIDIntegration = new apigateway.LambdaIntegration(delMediaByIDLambda)
        const getLinksByPostIdIntegration = new apigateway.LambdaIntegration(getLinksByPostIDLambda);
        const createLinkIntegration = new apigateway.LambdaIntegration(createLinkLambda);

        // Users
        const getAllUsersIntegration = new apigateway.LambdaIntegration(getAllUsersLambda);
        const getUserByIdIntegration = new apigateway.LambdaIntegration(getUserByIdLambda);
        const becomeSellerIntegration = new apigateway.LambdaIntegration(becomeSellerLambda)
        const followUserIntegration = new apigateway.LambdaIntegration(followUserLambda);
        const unfollowUserIntegration = new apigateway.LambdaIntegration(unfollowUserLambda);
        const getFollowersIntegration = new apigateway.LambdaIntegration(getFollowersLambda);
        const getFollowingIntegration = new apigateway.LambdaIntegration(getFollowingLambda);
        const getUserStatsIntergration = new apigateway.LambdaIntegration(getUserStatsLambda);
        const getUserCartIntergration = new apigateway.LambdaIntegration(getUserCartLambda);
        const addItemToCartIntergration = new apigateway.LambdaIntegration(addItemToCartLambda);
        const delItemFromCartIntergration = new apigateway.LambdaIntegration(delItemFromCartLambda);

        // Chats & Messages
        const createChatIntegration = new apigateway.LambdaIntegration(createChatLambda);
        const getChatsOfUserIntegration = new apigateway.LambdaIntegration(getChatsOfUserLambda);
        const createMessageIntegration = new apigateway.LambdaIntegration(createMessageLambda);
        const getMessagesOfChatIntegration = new apigateway.LambdaIntegration(getMessagesOfChatLambda);


        api.root.addMethod('GET', starterPageIntegration);


        // Adding Create user route from Auth
        const createUserResource = api.root.addResource('createuser');
        createUserResource.addMethod('POST', createUserIntegration);

        // Adding login user route from Auth
        const loginUserResource = api.root.addResource('loginuser');
        loginUserResource.addMethod('POST', loginUserIntegration);

        // adding get access token route from auth
        const getAccessTokenResource = api.root.addResource('getaccesstoken');
        getAccessTokenResource.addMethod('POST', getAcessTokenIntegration);

        // adding get current user route from auth
        const getCurrentUserResource = api.root.addResource('getcurrentuser');
        getCurrentUserResource.addMethod('GET', getCurrentUserIntegration);

        const becomeSellerResource = api.root.addResource('becomeseller');
        becomeSellerResource.addMethod('PUT', becomeSellerIntegration);

        const getUserStatsResource = api.root.addResource('getUserStats');
        getUserStatsResource.addMethod('PUT', getUserStatsIntergration); 

        //post endpoints
        const uploadPostResource = api.root.addResource('uploadPost');
        uploadPostResource.addMethod('POST', uploadPostIntegration)

        const uploadListingResource = api.root.addResource('uploadListing');
        uploadListingResource.addMethod('POST', uploadListingIntegration)

        const getAllPostsResource = api.root.addResource('getAllPosts');
        getAllPostsResource.addMethod('GET', getAllPostsIntegration);

        const getPostsByUserResource = api.root.addResource('getPostsByUser');
        getPostsByUserResource.addMethod('GET', getPostsByUserIntegration);

        const getPostByIdResource = api.root.addResource('getPostById');
        getPostByIdResource.addMethod('GET', getPostByIdIntegration);

        const getCommentByIdResource = api.root.addResource('getCommentById');
        getCommentByIdResource.addMethod('GET', getCommentByIDIntegration);

        const getCommentsByPostIdResource = api.root.addResource('getCommentsByPost');
        getCommentsByPostIdResource.addMethod('GET', getCommentsByPostIDIntegration);

        const createCommentResource = api.root.addResource('createComment');
        createCommentResource.addMethod('POST', createCommentIntegration);

        const delCommentResource = api.root.addResource('deleteResource');
        delCommentResource.addMethod('DELETE', delCommentIntegration);

        const delPostByIdResource = api.root.addResource('delPostById');
        delPostByIdResource.addMethod('DELETE', delPostByIdIntegration);

        const postSoldResource = api.root.addResource('postSold');
        postSoldResource.addMethod('PUT', postSoldIntergration);

        const getUserCartResource = api.root.addResource('getUserCart');
        getUserCartResource.addMethod('GET', getUserCartIntergration);

        const addItemToCartResource = api.root.addResource('addItemToCart');
        addItemToCartResource.addMethod('POST', addItemToCartIntergration);

        const delItemFromCartResource = api.root.addResource('delItemFromCart');
        delItemFromCartResource.addMethod('DELETE', delItemFromCartIntergration);

        const likePostResource = api.root.addResource('likePost');
        likePostResource.addMethod('POST', likePostIntegration);

        const unlikePostResource = api.root.addResource('unlikePost');
        unlikePostResource.addMethod('DELETE', unlikePostIntegration);

        const getLikeResource = api.root.addResource('getLike');
        getLikeResource.addMethod('GET', getLikeIntegration);

        const getLinksByPostIdResouce = api.root.addResource('getLinksByPostId');
        getLinksByPostIdResouce.addMethod('GET', getLinksByPostIdIntegration);

        const createLinkResource = api.root.addResource('createLink');
        createLinkResource.addMethod('POST', createLinkIntegration);

        // user endpoints
        const getAllUsersResource = api.root.addResource('getAllUsers');
        getAllUsersResource.addMethod('GET', getAllUsersIntegration);

        const getUsersByIdResource = api.root.addResource('getUserById');
        getUsersByIdResource.addMethod('GET', getUserByIdIntegration);

        const followUserResource = api.root.addResource('followUser');
        followUserResource.addMethod('POST', followUserIntegration);

        const unfollowUserResource = api.root.addResource('unfollowUser');
        unfollowUserResource.addMethod('DELETE', unfollowUserIntegration);

        const getFollowersResource = api.root.addResource('getFollowers');
        getFollowersResource.addMethod('GET', getFollowersIntegration);

        const getFollowingResource = api.root.addResource('getFollowing');
        getFollowingResource.addMethod('GET', getFollowingIntegration);

        const uploadChatResource = api.root.addResource('uploadChat');
        uploadChatResource.addMethod('POST', createChatIntegration);

        const uploadMessageResource = api.root.addResource('uploadMessage');
        uploadMessageResource.addMethod('POST', createMessageIntegration);

        const getChatsOfUserResource = api.root.addResource('getChatsOfUser');
        getChatsOfUserResource.addMethod('GET', getChatsOfUserIntegration);

        const getMessagesOfChat = api.root.addResource('getMessagesOfChat');
        getMessagesOfChat.addMethod('GET', getMessagesOfChatIntegration);


        //Media endpoints
        const uploadMediaResource = api.root.addResource('uploadMedia');
        uploadMediaResource.addMethod('POST', uploadMediaIntegration);

        const getAllMediaResource = api.root.addResource('getAllMedia');
        getAllMediaResource.addMethod('GET', getAllMediaIntegration);

        const getMediaByIDResource = api.root.addResource('getMediaByID');
        getMediaByIDResource.addMethod('GET', getMediaByIDIntegration);

        const getMediaByPostResource = api.root.addResource('getMediaByPost');
        getMediaByPostResource.addMethod('GET', getMediaByPostIntegration);

        const delMediaByIDResource = api.root.addResource('delMediaByID');
        delMediaByIDResource.addMethod('DELETE', delMediaByIDIntegration);



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
