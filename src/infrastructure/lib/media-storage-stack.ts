import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RemovalPolicy } from 'aws-cdk-lib';

export class S3BucketStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the S3 bucket
    this.bucket = new s3.Bucket(this, 'ImageBucket', {
      // Basic configuration
      bucketName: `sour-user-images-${this.account}-${this.region}`, // Optional: specify bucket name
      
      // Access configuration
      publicReadAccess: false, // Be cautious with public access
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // Recommended for security
      
      // Encryption configuration
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      
      // Versioning
      versioned: true, // Enable versioning for recovery
      
      // CORS configuration for web access
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            s3.HttpMethods.DELETE
          ],
          //TODO: this needs to be changed to the dynamic URL 
          allowedOrigins: ['http://localhost:8000'], // Add your frontend URLs
          allowedHeaders: ['*'],
          maxAge: 3600,
        },
      ],
      
      
      // For development, you might want to delete the bucket when destroying the stack
      removalPolicy: RemovalPolicy.DESTROY, // RETAIN in production
      autoDeleteObjects: true, // Only for development!
    });

    // Add bucket policy
    const bucketPolicy = new s3.BucketPolicy(this, 'BucketPolicy', {
      bucket: this.bucket,
    });

    // Example policy to allow specific IAM role access
    bucketPolicy.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.ServicePrincipal('lambda.amazonaws.com'),
        ],
        actions: [
          's3:GetObject',
          's3:PutObject',
          's3:DeleteObject', 
          's3:PostObject'
        ],
        resources: [
          this.bucket.arnForObjects('*'),
        ],
      })
    );

    // Output the bucket name and ARN
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'The name of the S3 bucket',
      exportName: 'ImageBucketName',
    });

    new cdk.CfnOutput(this, 'BucketArn', {
      value: this.bucket.bucketArn,
      description: 'The ARN of the S3 bucket',
      exportName: 'ImageBucketArn',
    });
  }
}
