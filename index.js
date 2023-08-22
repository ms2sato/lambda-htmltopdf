const { outputPdf } = require("./pdf");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

console.log("env.LOCAL", process.env.LOCAL);

let client;
if (process.env.LOCAL === "true") {
  client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: { accessKeyId: "FAKE", secretAccessKey: "FAKE" },
    endpoint: "http://localstack:4566",
    forcePathStyle: true,
  });
} else {
  client = new S3Client({ region: process.env.AWS_REGION || "us-east-1" });
}

exports.handler = async (event) => {
  const pdf = await outputPdf();

  const params = {
    Body: Buffer.from(pdf),
    Bucket: "test-bucket",
    ContentType: "application/pdf",
    ContentDisposition: "inline",
    Key: "pdfReport.pdf",
  };

  const command = new PutObjectCommand(params);
  const data = await client.send(command);
  console.log(data);

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
