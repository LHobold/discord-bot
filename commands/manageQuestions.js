import fs from "fs-extra";
const logsPath = new URL("../logs/userStatusLog.json", import.meta.url);

export async function addQuestion(msg) {
  const logsFile = await fs.readJSON(logsPath);
  const questions = logsFile.questions.map((q) => q.question.toLowerCase());

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

  await fs.writeFile(logsPath, JSON.stringify(logsFile)).catch(console.error);
}

export async function removeQuestion(msg) {
  const logsFile = await fs.readJSON(logsPath);
  const questions = logsFile.questions.map((q) => q.question.toLowerCase());

  // !pergunta remove Questão?
  const question = msg.split("remove")[1]?.trim().toLowerCase();

  if (!question) {
    throw new Error("Digite a pergunta que quer remover...");
  }

  if (!questions.includes(question)) {
    throw new Error("Essa pergunta não existe");
  }

  const newQuestions = logsFile.questions.filter(
    (q) => q.question !== question
  );

  logsFile.questions = newQuestions;

  await fs.writeFile(logsPath, JSON.stringify(logsFile)).catch(console.error);
}

export async function askQuestion(msg) {
  const logsFile = await fs.readJSON(logsPath);

  const question = msg.split("pergunta")[1]?.trim().toLowerCase();

  if (!question) {
    throw new Error("Digite a pergunta que quer fazer...");
  }

  const foundQuestion = logsFile.questions.find(
    (q) => q.question.toLowerCase() === question
  );

  if (!foundQuestion) {
    throw new Error("Essa pergunta não está na lista.");
  }

  return foundQuestion.answer;
}

export async function questionsList() {
  const logsFile = await fs.readJSON(logsPath);

  const questions = logsFile.questions.map((q) => q.question);

  if (questions.length === 0) {
    throw new Error(
      "Nenhuma pergunta na lista. Digite !pergunta add PERGUNTA;RESPOSTA para adicionar uma."
    );
  }

  const questionsStr = questions.join(", ");

  return questionsStr;
}
