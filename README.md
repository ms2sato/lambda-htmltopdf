## Usage

```
docker-compose up --build
```

### Request to sserver

```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d @test/body.json

{"statusCode":200,"body":{"bucket":"test-bucket","key":["debug1.pdf","debug2.pdf"]}}
```

### dev bucket
http://localhost:4566/test-bucket/