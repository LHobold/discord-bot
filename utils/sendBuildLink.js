import upperName from "./upperName.js";
import fs from "fs-extra";
const champsPath = new URL("../data/leagueChampions.json", import.meta.url);

export default async function sendLink(champ) {
  const championsNameArray = await fs
    .readJson(champsPath)
    .then((obj) => obj.map((c) => c.name.toLowerCase()));

  let champName = champ;

  if (!championsNameArray.includes(champName)) {
    throw new Error("Nenhum campeão com esse nome");
  }

  if (champName.includes("'")) {
    const nameArr = champName.split("'");
    champName = upperName(nameArr[0]) + upperName(nameArr[1]);
  } else {
    champName = upperName(champName);
  }

  return `https://www.lolvvv.com/pt/champion/${champName}/probuilds`;
}
