## Usage

```
docker-compose up --build
```

### Request to sserver

create pdf file named generated key
```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'

{"statusCode":200,"body":{"bucket":"test-bucket","key":"5c5a1132-b27b-43e1-8d0b-c5bb3728b20c.pdf"}}
```

create pdf file named posted key
```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"key":"mypdf.pdf"}'

{"statusCode":200,"body":{"bucket":"test-bucket","key":"mypdf.pdf"}}
```

### dev bucket
http://localhost:4566/test-bucket/