const express = require("express");
const AWS = require("aws-sdk");
const app = express();
const port = 80;

app.get("/", (req, res) => {
  const data = { headers: req.headers, env: process.env };
  res.send(data);
});

app.get("/upload", async (req, res) => {
  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: new Date().toISOString() + ".txt",
    Body: process.env.HOSTNAME || "Unknown",
  };

  try {
    await s3.upload(uploadParams).promise();
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
