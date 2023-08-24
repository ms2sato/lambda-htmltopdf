const { outputPdf } = require("./pdf");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
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

exports.handler = async ({ targets }) => {
  const rets = await outputPdf(targets);

  await Promise.all(rets.map(({ pdf, key }) => putToS3(pdf, key)));

  const response = {
    statusCode: 200,
    body: { bucket: bucket, key: targets.map(target => target.key) },
  };
  return response;
};

const putToS3 = async (pdf, key) => {
  const params = {
    Body: Buffer.from(pdf),
    Bucket: bucket,
    ContentType: "application/pdf",
    ContentDisposition: "inline",
    Key: key ?? `${crypto.randomUUID()}.pdf`,
  };

  const command = new PutObjectCommand(params);
  await client.send(command);
};
