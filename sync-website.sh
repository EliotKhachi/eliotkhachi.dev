#!/bin/bash
set -euo pipefail

# Prevent running as root since AWS credentials won't be found
if [ "$(id -u)" -eq 0 ]; then
  echo "Error: Please run this script as your normal user (not with sudo/root). AWS credentials must be available." >&2
  exit 1
fi

# Determine the directory this script resides in (project root)
SCRIPT_SRC="${BASH_SOURCE[0]:-$0}"
SCRIPT_DIR="$(cd "$(dirname "$SCRIPT_SRC")" && pwd)"

# Prompt the user to choose an AWS CLI profile (default or eliot)
read -p "Enter AWS CLI profile (default/eliot) [default]: " AWS_PROFILE
AWS_PROFILE=${AWS_PROFILE:-default}
if [[ "$AWS_PROFILE" != "default" && "$AWS_PROFILE" != "eliot" ]]; then
  echo "Error: Invalid profile. Use 'default' or 'eliot'." >&2
  exit 1
fi

# Sync from the site directory (where this script lives) to S3, deleting removed files
aws s3 sync --profile "$AWS_PROFILE" "$SCRIPT_DIR" s3://amazon-cloudfront-s3-secure-site-cus-s3bucketroot-1jdibk2916043 --exclude=".*" --delete
aws cloudfront create-invalidation --profile "$AWS_PROFILE" --distribution-id "$WEBSITE_CLOUDFRONT_DISTRIBUTION_ID" --paths="/*"
