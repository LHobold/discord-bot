import fs from "fs-extra";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import putS3Objects from "../utils/putS3Object.js";

const logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

export default async () => {
  const curLogs = await fs.readFile(logsPath, "utf-8");
  await putS3Objects(
    process.env.S3_BUCKET,
    process.env.S3_BUCKET_KEY,
    curLogs
  ).catch(console.error);
};
