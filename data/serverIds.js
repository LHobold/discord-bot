import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const users = {
  earlId: "232189605414305795",
  robsId: "232157423081619457",
  pauloId: "232157488529670145",
  thiagoId: "232232173317390336",
};

export const channels = {
  slappersId:
    process.env.NODE_ENV === "dev"
      ? "719721295452832093"
      : "869363826540281916",
  botModId: "869364246213967882",
  secretChannelId: "719721295452832093",
};

export const roles = { gadoId: "898985262770688111" };
