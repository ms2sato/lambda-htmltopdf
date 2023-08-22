## Usage
ref https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/nodejs-image.html
ref https://blog.shikoan.com/docker-compose-lambda/

### install aws-lambda-rie

```
mkdir -p ~/.aws-lambda-rie && \
    curl -Lo ~/.aws-lambda-rie/aws-lambda-rie https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie-arm64 && \
    chmod +x ~/.aws-lambda-rie/aws-lambda-rie
```

### docker build

```
docker build --platform linux/arm64 -t docker-image:test .
```

### docker run for daemon

```
docker run -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 \
    --entrypoint /aws-lambda/aws-lambda-rie \
    docker-image:test \
        /usr/local/bin/npx aws-lambda-ric index.handler
```

### Request to sserver

```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'

{"statusCode":200,"body":"\"Hello from Lambda!\""}
```
