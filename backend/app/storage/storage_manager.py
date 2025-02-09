import os
import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

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