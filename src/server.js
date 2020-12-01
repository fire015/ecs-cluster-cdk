const express = require("express");
const morgan = require("morgan");
const AWS = require("aws-sdk");
const app = express();
const port = process.env.PORT || 80;

app.use(morgan("tiny"));

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

// CPU intensive operation call with ?num=45
app.get("/fibo", (req, res) => {
  const fibo = (n) => {
    if (n < 2) {
      return 1;
    }

    return fibo(n - 2) + fibo(n - 1);
  };

  const num = fibo(parseInt(req.query.num || 1));
  res.send("Result is " + num);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
