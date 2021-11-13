output "lambda-labs-role-arn" {
  value = aws_iam_role.lambda-labs-role.arn
}

output "users-table-name" {
  value = aws_dynamodb_table.users-table.name
}
