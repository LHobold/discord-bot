import fs from "fs-extra";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import getS3Objects from "../utils/getS3Objects.js";

const logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

export default async () => {
  const json = await getS3Objects(
    process.env.S3_BUCKET,
    process.env.S3_BUCKET_KEY
  );
  await fs.writeJSON(logsPath, json);
};
