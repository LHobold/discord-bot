import {
  addQuestion,
  askQuestion,
  questionsList,
  removeQuestion,
} from "../commands/manageQuestions.js";
import getChannels from "../utils/getChannels.js";

export default (client) => {
  return client.on("messageCreate", async (msg) => {
    const msgContentLower = msg.content.toLowerCase();
    const msgContent = msg.content;
    const { slappersChannel, secretChannel } = getChannels(msg);
    const questionCommands = ["add", "remove", "list", "help"];
    const isCommand = questionCommands.some((e) => msgContent.includes(e));

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
        const { questionsStr, questionAmount } = await questionsList();
        const message = `Atualmente, existem ${questionAmount} perguntas:\n ${questionsStr}`;
        slappersChannel.send(message);
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

    if (msgContent.startsWith("!pergunta") && !isCommand) {
      try {
        const answer = await askQuestion(msgContent);
        slappersChannel.send(answer);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }
  });
};
