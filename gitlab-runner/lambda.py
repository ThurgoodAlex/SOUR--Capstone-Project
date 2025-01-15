import json
import boto3
import os

def lambda_handler(event, context):
    event = json.loads(event['body'])

    event_type = event['event_type']

    ec2 = boto3.client('ec2')

    instance_id = os.environ['RUNNER_INSTANCE_ID']

    response = ec2.describe_instances(
        InstanceIds=[instance_id]
    ) 

    current_state = response['Reservations'][0]['Instances'][0]['State']['Name']
    print(f"Current instance state: {current_state}")

    if event_type == "push":
        if current_state == 'stopped':
            response = ec2.start_instances(InstanceIds=[instance_id])
            return {
                'statusCode': 200,
                'body': json.dumps('Started GitLab runner instance')
            }
        else:
            return {
                'statusCode': 200,
                'body': json.dumps(f'Instance is already {current_state}')
            }
    elif event_type == "cleanup"
        ec2.stop_instances(InstanceIds=[instance_id])
        return {
            'statusCode' : 200, 
            'body': json.dumps('Gitlab runner stopped, resources cleaned up')
        }
    else: 
        return { 
            'statusCode': 400, 
            'body': json.dumps('malformed request') 
        }