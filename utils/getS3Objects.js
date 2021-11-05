import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

AWS.config.update({
  region: process.env.AWS_REGION,
  apiVersion: "latest",
  accessKeyId: process.env.AWS_ACESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const s3 = new AWS.S3();

function getS3Objects(bucket, key) {
  return new Promise((resolve, reject) => {
    s3.getObject(
      {
        Bucket: bucket,
        Key: key,
        ResponseContentType: "application/json",
      },
      (err, data) => {
        if (err) {
          return reject(err);
        }

        return resolve(JSON.parse(data.Body.toString("utf-8")));
      }
    );
  });
}

export default getS3Objects;
