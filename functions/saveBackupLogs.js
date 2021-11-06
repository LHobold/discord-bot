import fs from "fs-extra";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import AwsS3Connector from "../utils/AwsS3Connector.js";

const awsS3Connector = new AwsS3Connector();
const logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

export default async () => {
  const curLogs = await fs.readFile(logsPath, "utf-8");
  await awsS3Connector
    .putS3Objects(process.env.S3_BUCKET, process.env.S3_BUCKET_KEY, curLogs)
    .catch(console.error);
};
