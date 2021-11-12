output "remote_state_state_bucket_name" {
  value = module.remote_state.state_bucket.bucket
}

output "remote_state_kms_key_id" {
  value = module.remote_state.kms_key.id
}
