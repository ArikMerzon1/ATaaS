import { S3, SNS } from "aws-sdk";

let s3CachedClient: S3 | null = null;
let snsCachedClient: SNS | null = null;

export function getS3Client(): S3 {
  if (!s3CachedClient) {
    s3CachedClient = new S3();
  }
  return s3CachedClient;
}

export function getSnsClient(): SNS {
  if (!snsCachedClient) {
    snsCachedClient = new SNS();
  }
  return snsCachedClient;
}
