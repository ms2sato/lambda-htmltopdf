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
const region = process.env.AWS_REGION || "us-east-1";

let client;
if (process.env.LOCAL === "true") {
  client = new S3Client({
    region,
    credentials: { accessKeyId: "FAKE", secretAccessKey: "FAKE" },
    endpoint: "http://localstack:4566",
    forcePathStyle: true,
  });
} else {
  client = new S3Client({ region });
}

exports.handler = async (event) => {
  const ret = await execute(event);
  const response = {
    statusCode: 200,
    body: { bucket, ...ret },
  };
  return response;
};

const execute = async (event) => {
  const { pdf, key } = await outputPdf(event);

  const ret = await putToS3(pdf, key, event.option?.signedUrl);
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
