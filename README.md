# Lambda HTML2PDF function from a container image

Lambda function to render HTML into PDF, alternative to wkhtmltopdf. Implemented by Chromium and Puppeteer.

## Usage local development

### Start dev server

```
docker compose up --build
```

### Restart lambda server only

```
bin/restart
```

### Request to dev server

POST data is `test/event.json` (for emulate function url)

```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -H 'content-type: application/json' -d @test/event.json

{"statusCode":200,"body":{"bucket":"test-bucket","key":"mydir/debug1.pdf","signedUrl":"http://localstack:4566/test-bucket/mydir/debug1.pdf?..." }}
```

### Access dev S3 bucket

http://localhost:4566/test-bucket/

## Deploy

### 1st deploy to ECR

1. Create new ECR Repository
2. The first deploy to ECR Repository
  - add `DOCKER_REPOSITORY` environment variable to `.env`
  - call `bin/ecr-deploy`

### Lambda function setup
1. Create new lambda function for Docker Image in AWS Lambda console
2. Set environment variable `AWS_S3_BUCKET` as bucket name for writing pdf
3. Add Permission for S3 Bucket on Lambda function role
4. Set Timeout 1 min or more, Memory 1024MB or more

### Edit .env

Copy `.env.sample` as `.env` and edit.

- `AWS_REGION` Region of lambda function and S3 bucket( ex. ap-northeast-1 )
- `AWS_LAMBDA_FUNCTION` Name of lambda function to deploy
- `DOCKER_REPOSITORY` ECR URI for deploy( ex. xxx.dkr.ecr.ap-northeast-1.amazonaws.com/xxx )
- [optional] `DOCKER_DEFAULT_PLATFORM` Docker platform( ex. linux/amd64 )
- [optional] `APP_NAME` Docker image name for build on deploy
- [optional] `DOCKER_TAG` Docker image tag for build on deploy

### Run deploy

```
bin/deploy
```

### Test

#### 1. From AWS Management Console

Test event data is `test/params.json` fixed bucket name in `AWS_S3_BUCKET`, an run it.

#### 2. Request to deployed Lambda function URLs

If you set up Lambda function URL, you can call it directly.
POST data is `test/params.json`

```
curl -XPOST "https://xxx.lambda-url.xxx.on.aws" -H 'content-type: application/json' -d @test/params.json

{"statusCode":200,"body":{"bucket":"test-bucket-xxx","key":"mydir/debug1.pdf","signedUrl":"https:\/\/test-bucket-xxx.s3.xxx.amazonaws.com\/mydir\/debug1.pdf?..." }}
```

## Optional

### Create test data

Fix `test/generate.js` and run it.


```
test/generate.js
```

`test/event.json` and `test/params.json` will be created.
