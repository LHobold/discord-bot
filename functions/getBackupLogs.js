import fs from "fs-extra";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import AwsS3Connector from "../utils/AwsS3Connector.js";

const logsPath = new URL("../logs/userStatusLog.json", import.meta.url);
const awsS3Connector = new AwsS3Connector();

export default async () => {
  const json = await awsS3Connector.getS3Objects(
    process.env.S3_BUCKET,
    process.env.S3_BUCKET_KEY
  );
  console.log("Getting updated logs from S3");
  await fs.writeJSON(logsPath, json);
  console.log("S3 updated logs retrieved sucessfully");
};
