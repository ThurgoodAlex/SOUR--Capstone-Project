import json
import boto3
import os

def lambda_handler(event, context):

    body = json.loads(event['body'])
    object_kind = body["object_kind"]
    
    ec2 = boto3.client('ec2')
    instance_id = os.environ['RUNNER_INSTANCE_ID']
    
    if object_kind == "push":
        response = ec2.start_instances(
            InstanceIds=[instance_id]
        )
        return {
            'statusCode': 200,
            'body': json.dumps('Started GitLab runner instance')
        }
    elif object_kind == "pipeline":

        
        response = ec2.stop_instances(
            InstanceIds=[instance_id]
        )
        return {
            'statusCode': 200,
            'body': json.dumps('Stopped GitLab runner instance')
        }