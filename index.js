const pdf = require("./pdf");

exports.handler = async (event) => {
  const ret = await pdf.outputPdf();
  console.log("ret", ret);

  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!"),
  };
  return response;
};
