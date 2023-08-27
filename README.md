## Usage

```
docker-compose up --build
```

### Request to server

POST data is `test/body.json` (for emulate function url)

```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -H 'content-type: application/json' -d @test/body.json

{"statusCode":200,"body":{"bucket":"test-bucket","key":"mydir/debug1.pdf","signedUrl":"http://localstack:4566/test-bucket/mydir/debug1.pdf?..." }}
```

### Request to deployed function url

POST data is `test/params.json`

```
curl -XPOST "https://xxx.lambda-url.xxx.on.aws" -H 'content-type: application/json' -d @test/params.json

{"statusCode":200,"body":{"bucket":"test-bucket-xxx","key":"mydir/debug1.pdf","signedUrl":"https:\/\/test-bucket-xxx.s3.xxx.amazonaws.com\/mydir\/debug1.pdf?..." }}
```

### dev bucket

http://localhost:4566/test-bucket/
