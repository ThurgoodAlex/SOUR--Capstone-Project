import magic
from datetime import datetime
from mypy_boto3_s3.client import S3Client
from .socialexceptions import(
    InvalidFileType, 
)

class MediaUploader:
    def __init__(
            self,
            aws_region:str, 
            aws_account_id:str,
            endpoint:str,
            s3_client:S3Client,
        ):
        self.region = aws_region
        self.account_id = aws_account_id
        self.client = s3_client
        self.endpoint = endpoint

    def upload_Photo_to_S3(
            self,
            file_path,
            user_id:int, 
            post_id:int,
        ):

        with open(file_path, 'rb') as file:
            file_mime_type = self.get_mime_type(file_path).split('/')[0]

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        if file_mime_type not in ["video", "image"]:
            raise InvalidFileType(file_mime_type)

        split_file_path_array = file_path.split('/')
        filename = split_file_path_array[len(split_file_path_array) -1]

        unique_filename = f"{user_id}/{post_id}/{file_mime_type}/{timestamp}_{filename}"

        with open(file_path, 'rb') as file:
            self.client.put_object(
                Bucket=f"sour-user-images-{self.account_id}-{self.region}",
                Key=unique_filename,
                Body=file,
                ContentType=file_mime_type
            )

        img_url = f"{self.endpoint}/sour-user-images-{self.account_id}-{self.region}/{unique_filename}"

        is_video = file_mime_type == "video"

        return img_url, is_video

    
    def get_mime_type(self,file):
        
        mime = magic.Magic(mime=True)
        
        mime_type = mime.from_file(file)
        
        return mime_type


