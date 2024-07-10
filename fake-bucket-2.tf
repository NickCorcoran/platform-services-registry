provider "aws" {
  region = "us-west-2"  # Specify the AWS region
}

resource "aws_s3_bucket" "public_bucket" {
  bucket = "my-public-bucket"  # Replace with your unique bucket name
  acl    = "public-read"

  # Disable default encryption
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "None"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.public_bucket.id

  block_public_acls   = false
  block_public_policy = false
  ignore_public_acls  = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_policy" {
  bucket = aws_s3_bucket.public_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = "*"
        Action = "s3:GetObject"
        Resource = "${aws_s3_bucket.public_bucket.arn}/*"
      }
    ]
  })
}
