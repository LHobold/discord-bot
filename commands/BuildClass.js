import upperName from "../utils/upperName.js";
import fs from "fs-extra";

export default class Build {
  champsPath = new URL("../data/leagueChampionsName.json", import.meta.url);

  getProbuildUrl(champName) {
    return `https://www.lolvvv.com/pt/champion/${champName}/probuilds`;
  }

  async sendBuildLink(msg) {
    const championsNameArray = await fs.readJSON(this.champsPath);
    let champName = msg.split(":")[1].trim();

    if (!championsNameArray.includes(champName)) {
      throw new Error("Nenhum campeão com esse nome");
    }

    if (champName.includes("'")) {
      const nameArr = champName.split("'");
      champName = upperName(nameArr[0]) + upperName(nameArr[1]);
      champName === "KaiSa" ? (champName = "Kaisa") : "";
    } else {
      champName = upperName(champName);
    }
    return this.getProbuildUrl(champName);
  }
}
