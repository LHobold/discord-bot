import { users, channels, roles } from "./data/serverIds.js";
import {
  addQuestion,
  askQuestion,
  questionsList,
  removeQuestion,
} from "./commands/manageQuestions.js";

// Ids
const { earlId, robsId, pauloId, thiagoId } = users;
const { slappersId, botModId, secretChannelId } = channels;

export default (client) => {
  return client.on("messageCreate", async (msg) => {
    const msgContentLower = msg.content.toLowerCase();
    const msgContent = msg.content;
    const test = true;
    const slappersChannel =
      test === true
        ? msg.guild.channels.cache.get(secretChannelId)
        : msg.guild.channels.cache.get(slappersId);

    const secretChannel = msg.guild.channels.cache.get(secretChannelId);

    if (msgContentLower.startsWith("!pergunta add")) {
      try {
        await addQuestion(msgContent);
        slappersChannel.send("Pergunta adicionada com sucesso!");
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContentLower.startsWith("!pergunta remove")) {
      try {
        await removeQuestion(msgContent);
        slappersChannel.send("Pergunta removida com sucesso!");
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContentLower.startsWith("!pergunta list")) {
      try {
        const questions = await questionsList();
        slappersChannel.send(questions);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContentLower.startsWith("!pergunta help")) {
      try {
        const message =
          "Para visualizar as perguntas disponíveis digite !pergunta list. \nPara adicionar uma pergunta digite !pergunta add PERGUNTA;RESPOSTA. \nPara remover uma pergutna digite !pergunta remove PERGUNTA";
        slappersChannel.send(message);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (
      msgContent.startsWith("!pergunta") &&
      !msgContent.includes("add") &&
      !msgContent.includes("remove") &&
      !msgContent.includes("list") &&
      !msgContent.includes("help")
    ) {
      try {
        const answer = await askQuestion(msgContent);
        slappersChannel.send(answer);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }
  });
};
