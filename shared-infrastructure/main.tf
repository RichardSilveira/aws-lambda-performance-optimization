terraform {
  backend "s3" {
    bucket     = "tf-remote-state-lambdalabs20211112231838666300000002"
    key        = "dev/terraform.tfstate"
    region     = "us-east-2"
    encrypt    = true
    kms_key_id = "8fbf076d-38e9-4825-a19e-e8cb5b77162f"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.4"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

locals {
  tags_shared = {
    Project = "Lambda Labs Optimization"
  }
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

resource "aws_iam_role" "lambda-labs-role" {
  name        = "lambda-labs-role"
  description = "Role used by the Lambda Labs Optimization microservice"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Sid       = ""
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  managed_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
  # Isn't a good practice, but I'll leave as-is for simplicity
}

resource "aws_dynamodb_table" "users-table" {
  name         = "users-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = merge(local.tags_shared, { Name = "users-table" })
}
