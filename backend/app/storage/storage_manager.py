import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv
from datetime import datetime
import uuid

load_dotenv()

class S3StorageManager:
    def __init__(self, init_bucket: bool = False):
        self.access_key = os.getenv("AWS_ACCESS_KEY_ID")
        self.secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        self.bucket_name = os.getenv("AWS_BUCKET_NAME")
        self.region = os.getenv("AWS_REGION")
        
        # Initialize S3 client
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            region_name=self.region
        )
        
        # Test connection
        try:
            self.s3_client.list_buckets()
            print("Successfully connected to AWS S3")
        except ClientError as e:
            print(f"Failed to connect to AWS S3: {e.response}")
        
        # Ensure bucket exists only if requested
        if init_bucket:
            self._ensure_bucket_exists()
    
    def _ensure_bucket_exists(self) -> bool:
        """
        Check if the bucket exists, if not create it
        Returns:
            bool: True if bucket exists or was created successfully
        """
        try:
            # Try to create the bucket
            self.s3_client.create_bucket(
                Bucket=self.bucket_name,
                CreateBucketConfiguration={
                    'LocationConstraint': self.region
                }
            )
            print(f"Created bucket {self.bucket_name} in {self.region}")
            return True
        except ClientError as e:
            error_code = e.response.get('Error', {}).get('Code')
            
            # If bucket already exists and we own it, that's fine
            if error_code == 'BucketAlreadyOwnedByYou':
                print(f"Bucket {self.bucket_name} already exists and is owned by you")
                return True
            
            print(f"Error with bucket operation: {e.response}")
            return False

    def upload_file(self, file_obj) -> str:
        """
        Upload a file to S3 bucket with a unique key
        Args:
            file_obj: File object to upload (BytesIO with filename attribute)
        Returns:
            str: The S3 key of the uploaded file
        """
        # Ensure bucket exists before upload
        if not self._ensure_bucket_exists():
            raise Exception("Failed to ensure bucket exists")

        # Generate a unique file key
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        original_filename = getattr(file_obj, 'filename', 'unknown')
        file_key = f"{timestamp}_{unique_id}_{original_filename}"

        try:
            # Reset file pointer to beginning
            file_obj.seek(0)
            
            # Upload file
            self.s3_client.upload_fileobj(
                file_obj,
                self.bucket_name,
                file_key,
                ExtraArgs={'ContentType': 'application/pdf'}
            )
            print(f"Successfully uploaded file to {file_key}")
            return file_key
        except ClientError as e:
            print(f"Error uploading file: {e.response}")
            raise

    def get_file_url(self, file_key: str, expiration: int = 3600) -> str:
        """
        Generate a presigned URL for accessing a file
        Args:
            file_key: The S3 key of the file
            expiration: URL expiration time in seconds (default 1 hour)
        Returns:
            str: Presigned URL for file access
        """
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': self.bucket_name,
                    'Key': file_key
                },
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            print(f"Error generating presigned URL: {e.response}")
            raise

    def get_file_content(self, file_key: str) -> bytes:
        """
        Get the content of a file directly
        Args:
            file_key: The S3 key of the file
        Returns:
            bytes: File content
        """
        try:
            response = self.s3_client.get_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            return response['Body'].read()
        except ClientError as e:
            print(f"Error retrieving file: {e.response}")
            raise

    def delete_all_files(self) -> bool:
        """
        Delete all files from the S3 bucket
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # List all objects in the bucket
            objects = []
            paginator = self.s3_client.get_paginator('list_objects_v2')
            pages = paginator.paginate(Bucket=self.bucket_name)
            
            for page in pages:
                if 'Contents' in page:
                    objects.extend(page['Contents'])

            if not objects:
                print("No files to delete")
                return True

            # Delete all objects
            delete_keys = {'Objects': [{'Key': obj['Key']} for obj in objects]}
            self.s3_client.delete_objects(
                Bucket=self.bucket_name,
                Delete=delete_keys
            )
            
            print(f"Successfully deleted {len(objects)} files")
            return True
            
        except ClientError as e:
            print(f"Error deleting files: {e.response}")
            return False

    def list_files(self) -> dict:
        """
        List all files in the S3 bucket with their metadata
        Returns:
            dict: Dictionary containing files and their metadata
        """
        try:
            files = []
            paginator = self.s3_client.get_paginator('list_objects_v2')
            pages = paginator.paginate(Bucket=self.bucket_name)
            
            for page in pages:
                if 'Contents' in page:
                    for obj in page['Contents']:
                        # Generate a presigned URL for each file
                        file_url = self.get_file_url(obj['Key'])
                        
                        # Add file metadata
                        files.append({
                            'key': obj['Key'],
                            'size': obj['Size'],
                            'last_modified': obj['LastModified'].isoformat(),
                            'url': file_url
                        })
            
            return {
                'files': files,
                'total': len(files)
            }
            
        except ClientError as e:
            print(f"Error listing files: {e.response}")
            raise