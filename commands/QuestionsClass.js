import fs from "fs-extra";

export default class Questions {
  logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

  async getInitData(lower = true) {
    const logsFile = await fs.readJSON(this.logsPath);
    const questions =
      logsFile?.questions.map((q) =>
        lower ? q.question.toLowerCase() : q.question
      ) || [];
    return { logsFile, questions };
  }

  async addQuestion(msg) {
    const { logsFile, questions } = await this.getInitData();
    const question = msg.split("add")[1].split(";")[0]?.trim();
    const answer = msg.split("add")[1].split(";")[1]?.trim();

    if (!question) {
      throw new Error("Uma pergunta precisa de uma pergunta, lol");
    }

    if (!answer) {
      throw new Error("Uma pergunta precisa de uma resposta");
    }

    if (questions.includes(question.toLowerCase())) {
      throw new Error(
        "Essa pergunta já existe. \nDigite !pergunta list para ver todas as perguntas"
      );
    }

    const newQuestion = {
      question,
      answer,
    };
    logsFile.questions.push(newQuestion);
    await fs.writeJSON(this.logsPath, logsFile).catch(console.error);
  }

  async removeQuestion(msg) {
    const { logsFile, questions } = await this.getInitData();
    const question = msg.split("remove")[1]?.trim().toLowerCase();

    if (!question) {
      throw new Error("Digite a pergunta que quer remover...");
    }

    if (!questions.includes(question)) {
      throw new Error("Essa pergunta não existe");
    }

    const newQuestions = logsFile.questions.filter(
      (q) => q.question.toLowerCase() !== question
    );

    logsFile.questions = newQuestions;
    await fs.writeJSON(this.logsPath, logsFile).catch(console.error);
  }

  async askQuestion(msg) {
    const { logsFile } = await this.getInitData();
    const askedQuestion = msg.split("pergunta")[1]?.trim().toLowerCase();

    if (!askedQuestion) {
      throw new Error("Digite a pergunta que quer fazer...");
    }

    const foundQuestion = logsFile.questions.find(
      (q) => q.question.toLowerCase() === askedQuestion
    );

    if (!foundQuestion) {
      throw new Error("Essa pergunta não está na lista.");
    }

    return foundQuestion.answer;
  }

  async questionsList() {
    const { questions } = await this.getInitData(false);

    if (questions.length === 0) {
      throw new Error(
        "Nenhuma pergunta na lista. Digite !pergunta add PERGUNTA;RESPOSTA para adicionar uma."
      );
    }

    const questionsStr = questions.join("\n ");

    return `Atualmente, existem ${questions.length} perguntas:\n ${questionsStr}`;
  }

  questionsHelp() {
    return "Para visualizar as perguntas disponíveis digite !pergunta list. \nPara adicionar uma pergunta digite !pergunta add PERGUNTA;RESPOSTA. \nPara remover uma pergutna digite !pergunta remove PERGUNTA";
  }
}
