provider "aws" {
  region = "us-east-2"
}

provider "aws" {
  alias  = "replica"
  region = "us-west-2"
}

module "remote_state" {
  source                           = "nozaq/remote-state-s3-backend/aws"
  dynamodb_table_name              = "tf-remote-state-lock-lambdalabs"
  state_bucket_prefix              = "tf-remote-state-lambdalabs"
  replica_bucket_prefix            = "tf-remote-state-replica-lambdalabs"
  kms_key_description              = "The key used to encrypt the remote state bucket - lambdalabs"
  terraform_iam_policy_name_prefix = "terraform-lambdalabs"

  providers = {
    aws         = aws
    aws.replica = aws.replica
  }
}

resource "aws_iam_user" "terraform" {
  name = "terraform-user-lambdalabs"
}

resource "aws_iam_user_policy_attachment" "remote_state_access" {
  user       = aws_iam_user.terraform.name
  policy_arn = module.remote_state.terraform_iam_policy.arn
}
