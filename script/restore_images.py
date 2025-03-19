import os
import boto3

BUCKET_NAME = "sour-user-images-000000000000-us-west-1"
AWS_REGION = os.environ.get('CDK_DEFAULT_REGION', 'us-west-1')
AWS_ACCOUNT_ID = os.environ.get('CDK_DEFAULT_ACCOUNT', '000000000000')

s3_client = boto3.client('s3', region_name=AWS_REGION)

if __name__ == "__main__":

    script_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(script_dir, "photos")

    def upload_images(directory_path):
        items = os.listdir(directory_path)

        for item in items:
            item_path = os.path.join(directory_path, item)

            if os.path.isdir(item_path):
                upload_images(item_path)
            else:
                with open(item_path, 'rb') as file:
                    file_content = file.read()

                    # Extract relative path and modify key format
                    relative_path = item_path[len(file_path) + 1:] 
                    directory, filename = os.path.split(relative_path)
                    
                    # Ensure ".jpg" extension is lowercase
                    name, ext = os.path.splitext(filename)
                    new_filename = f"{name}.jpg"  # Force lowercase ".jpg"
                    
                    # Add "/image" after the first directory
                    key_path = os.path.join(directory, "image", new_filename)
                    key_path = key_path.replace("\\", "/")  # Ensure correct S3 key format

                    print(key_path)  # Debugging output
                    
                    s3_client.put_object(
                        Bucket=BUCKET_NAME,
                        Key=key_path,
                        Body=file_content,
                        ContentType="image/jpeg"
                    )

    upload_images(file_path)