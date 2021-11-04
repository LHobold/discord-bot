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

function putS3Objects(bucket, key, body) {
  return new Promise((resolve, reject) => {
    s3.putObject(
      {
        Bucket: bucket,
        Key: key,
        Body: body,
      },
      (err, data) => {
        if (err) {
          reject(`Could not save logs: ${err}`);
        } else {
          resolve(console.log("Logs saved sucessfully"));
        }
      }
    );
  });
}

export default putS3Objects;
