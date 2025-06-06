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

### Prerequisites

- Create new lambda function
  - Set environment variable `AWS_S3_BUCKET` as bucket name for writing pdf
- Create new ECR repository

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

### Request to deployed Lambda function URLs

POST data is `test/params.json`

```
curl -XPOST "https://xxx.lambda-url.xxx.on.aws" -H 'content-type: application/json' -d @test/params.json

{"statusCode":200,"body":{"bucket":"test-bucket-xxx","key":"mydir/debug1.pdf","signedUrl":"https:\/\/test-bucket-xxx.s3.xxx.amazonaws.com\/mydir\/debug1.pdf?..." }}
```

## Optional

### Create test data

Create `test/event.json` and `test/params.json`.

```
test/generate.js
```
