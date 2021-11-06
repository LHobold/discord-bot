import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default class AwsS3Connector {
  getS3Auth() {
    AWS.config.update({
      region: process.env.AWS_REGION,
      apiVersion: "latest",
      accessKeyId: process.env.AWS_ACESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    return new AWS.S3();
  }

  putS3Objects(bucket, key, body) {
    const s3 = this.getS3Auth();
    return new Promise((resolve, reject) => {
      s3.putObject(
        {
          Bucket: bucket,
          Key: key,
          Body: body,
        },
        (err, data) => {
          if (err) {
            return reject(`Could not save logs: ${err}`);
          }
          console.log("PUTLOGS");
          return resolve(console.log("Logs saved sucessfully"));
        }
      );
    });
  }

  getS3Objects(bucket, key) {
    const s3 = this.getS3Auth();
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
          console.log("GETLOGS");
          return resolve(JSON.parse(data.Body.toString("utf-8")));
        }
      );
    });
  }
}
