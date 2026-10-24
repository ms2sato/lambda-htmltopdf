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

### Local development options

Environment variables for `docker compose` (put them in `.env` or pass on the command line):

| Variable | Default | Purpose |
|---|---|---|
| `HOST_PORT` | `9000` | Host port of the Lambda RIE. Change it when another RIE-based function (e.g. lambda-xlsxtopdf) already listens on 9000 |
| `LOCALSTACK_PORT` | `4566` | Host port of LocalStack |
| `S3_ENDPOINT` | `http://localstack:4566` | S3 endpoint the function uses when `LOCAL=true`. Any S3-compatible store works (e.g. [versitygw](https://github.com/versity/versitygw) with `ROOT_ACCESS_KEY=FAKE` / `ROOT_SECRET_KEY=FAKE`). The signed URL is built from this host, so the client that downloads the PDF must be able to resolve it |

Notes:

- The LocalStack image is pinned to `localstack/localstack:4.0`. The `2026.x` images require a LocalStack license and exit on startup.
- The image is `linux/x86_64` because `@sparticuz/chromium` ships an x64 binary only. On an arm64 host (Apple Silicon, Linux arm64) run `docker run --privileged --rm tonistiigi/binfmt --install amd64` once; rendering then takes about 15-20 seconds per PDF under emulation.
- The Lambda RIE handles one invocation at a time and can crash (nil pointer panic) when it receives concurrent requests. Call it sequentially from your tests.

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
