import pytest
import boto3
import hashlib
from botocore.exceptions import ClientError
from pathlib import Path
import mimetypes

class MediaComparator:
    """Use this class to compare two images or two videos. It does so by comparing the hash"""
    def __init__(self):
        self.s3_client = boto3.client('s3')
    
    def calculate_hash(self, data: bytes) -> str:
        return hashlib.sha256(data).hexdigest()

    def get_s3_media(self, bucket: str, key: str) -> tuple[bytes, str]:
        """Retrieve a media object from Amazon S3.
        
        Fetches the specified object from the given S3 bucket and returns both
        the binary content and the content type of the object.
        
        Args:
            bucket: The name of the S3 bucket containing the media object.
            key: The object key (path) within the S3 bucket.
        
        Returns:
            A tuple containing:
                - bytes: The binary content of the media object.
                - str: The content type of the media object (MIME type).
                  Returns an empty string if content type is not available.
        
        Raises:
            Exception: If the retrieval operation fails.
        
        Examples:
            >>> media_service = MediaService()
            >>> content, content_type = media_service.get_s3_media("my-bucket", "images/photo.jpg")
            >>> print(f"Retrieved {len(content)} bytes with type {content_type}")
            Retrieved 24580 bytes with type image/jpeg
        """       
        try:
            response = self.s3_client.get_object(Bucket=bucket, Key=key)
            content_type = response.get('ContentType', '')
            return response['Body'].read(), content_type
        except ClientError as e:
            raise Exception(f"Failed to fetch media from S3: {str(e)}")
    
    def get_local_media(self, path: str) -> tuple[bytes, str]:
        try:
            content_type, _ = mimetypes.guess_type(str(path))
            return Path(path).read_bytes(), content_type or ''
        except Exception as e:
            raise Exception(f"Failed to read local media: {str(e)}")
    
    def is_video(self, content_type: str) -> bool:
        return content_type.startswith('video/')
    
    def compare_media(self, s3_data: tuple[bytes, str], local_data: tuple[bytes, str]) -> bool:
        s3_content, s3_type = s3_data
        local_content, local_type = local_data
        
        s3_hash = self.calculate_hash(s3_content)
        local_hash = self.calculate_hash(local_content)

        return s3_hash == local_hash
    

    