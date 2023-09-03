const { outputPdf } = require("./pdf");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

if (!process.env.AWS_S3_BUCKET) {
  throw new Error("AWS_S3_BUCKET is required");
}

const bucket = process.env.AWS_S3_BUCKET;

let client;
if (process.env.LOCAL === "true") {
  client = new S3Client({
    credentials: { accessKeyId: "FAKE", secretAccessKey: "FAKE" },
    endpoint: "http://localstack:4566",
    forcePathStyle: true,
  });
} else {
  client = new S3Client();
}

class InputError extends Error {
  constructor(message) {
    super(message);
    this.name = "InputError";
  }
}

const checkPayload = (params) => {
  if (!params.key) {
    throw new InputError("params.key is required");
  }
  if (!params.content) {
    throw new InputError("params.content is required");
  }

  if (params.option) {
    if (params.option.signedUrl) {
      if (
        typeof params.option.signedUrl !== "boolean" &&
        typeof params.option.signedUrl !== "object"
      ) {
        throw new InputError(
          "params.option.signedUrl must be boolean or object"
        );
      }
    }
    if (params.option.pdf) {
      if (typeof params.option.pdf !== "object") {
        throw new InputError("params.option.pdf must be object");
      }
    }
  }
};

exports.handler = async (event, context) => {
  try {
    let payload;
    if (event.requestContext) {
      // for function URLs
      payload = JSON.parse(event.body);
    } else if (event.httpMethod) {
      // for API Gateway
      payload = JSON.parse(event.body);
    } else if (event.Records && event.Records[0]?.s3) {
      // for S3
      throw new Error("Not supported");
    } else {
      // for test
      payload = event;
    }

    checkPayload(payload);

    const ret = await execute(payload);
    const response = {
      statusCode: 200,
      body: { bucket, ...ret },
    };
    return response;
  } catch (err) {
    if (err instanceof InputError) {
      console.error(`Error(400): ${err.message}`);
    } else {
      console.error(`Error(500): ${err.message}`);
    }
    console.error(err);
    throw err;
  }
};

const execute = async (params) => {
  const { pdf, key } = await outputPdf(params);

  const ret = await putToS3(pdf, key, params.option?.signedUrl);
  return { key, ...ret };
};

const putToS3 = async (pdf, key, signedUrlOption) => {
  const params = {
    Body: Buffer.from(pdf),
    Bucket: bucket,
    ContentType: "application/pdf",
    ContentDisposition: "inline",
    Key: key ?? `${crypto.randomUUID()}.pdf`,
  };

  const command = new PutObjectCommand(params);
  await client.send(command);

  if (signedUrlOption === undefined) {
    return {};
  }

  const getObjectCommand = new GetObjectCommand({
    Bucket: params.Bucket,
    Key: params.Key,
  });
  const signedUrl = await getSignedUrl(
    client,
    getObjectCommand,
    typeof signedUrlOption === "boolean" ? {} : signedUrlOption
  );
  return { signedUrl };
};
