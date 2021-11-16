import Questions from "../commands/QuestionsClass.js";
import getChannels from "../utils/getChannels.js";
import { prefix } from "../config/config.js";

export default (client) => {
  const questions = new Questions();

  return client.on("messageCreate", async (msg) => {
    const msgContentLower = msg.content.toLowerCase();
    const msgContent = msg.content;
    const { slappersChannel } = getChannels(msg);
    const questionCommands = ["add", "remove", "list", "help"];
    const isCommand = questionCommands.some((e) => msgContent.includes(e));

    if (!msgContentLower.trim().startsWith(`${prefix}pergunta`)) {
      return;
    }

    if (msgContentLower.startsWith(`${prefix}pergunta add`)) {
      try {
        await questions.addQuestion(msgContent);
        slappersChannel.send("Pergunta adicionada com sucesso!");
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContentLower.startsWith(`${prefix}pergunta remove`)) {
      try {
        await questions.removeQuestion(msgContent);
        slappersChannel.send("Pergunta removida com sucesso!");
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContentLower.startsWith(`${prefix}pergunta list`)) {
      try {
        const message = await questions.questionsList();
        slappersChannel.send(message);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContentLower.startsWith(`${prefix}pergunta help`)) {
      try {
        const message = questions.questionsHelp();
        slappersChannel.send(message);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }

    if (msgContent.startsWith(`${prefix}pergunta`) && !isCommand) {
      try {
        const answer = await questions.askQuestion(msgContent);
        slappersChannel.send(answer);
      } catch (err) {
        slappersChannel.send(err.message);
      }
    }
  });
};
