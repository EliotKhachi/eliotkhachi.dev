#!/bin/bash
set -euo pipefail
aws s3 sync "$REPOS/eliotkhachi.dev" s3://amazon-cloudfront-s3-secure-site-cus-s3bucketroot-1jdibk2916043 --exclude=".*" --delete
aws cloudfront create-invalidation --distribution-id "$WEBSITE_CLOUDFRONT_DISTRIBUTION_ID" --paths="/*"
