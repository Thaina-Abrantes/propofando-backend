/* eslint-disable no-await-in-loop */
const { SimulatedRepository } = require('../repositories/SimulatedRepository');
const { SimulatedSortQuestionsRepository } = require('../repositories/SimulatedSortQuestionsRepository');
const { QuestionRepository } = require('../repositories/QuestionRepository');
const { sortedQuestions } = require('../helpers/utils');

const simulatedRepository = new SimulatedRepository();
const simulatedSortQuestionsRepository = new SimulatedSortQuestionsRepository();
const questionRepository = new QuestionRepository();

async function createSimulated(request, response) {
  const { userId, quantityQuestions } = request.body;
  let { name } = request.body;

  const simuladoActive = await simulatedRepository.findBy(
    { userId, active: true },
  );

  if (simuladoActive.length >= 1) {
    return response.status(400).json({ message: 'Existe um simulado ativo' });
  }

  const allSimulatedSortUser = await simulatedSortQuestionsRepository.findBy(
    { userId },
  );

  if (!name) {
    name = `Simulado ${allSimulatedSortUser.length}`;
  }

  // Refactor: Trazer apenas questões diponiveis do usuario por categoria escolhida se for o caso

  const allQuestionsAvailable = await questionRepository.getQuestionsAvailable(userId);
  console.log(allQuestionsAvailable, 'ques');

  const registeredSimulated = await simulatedRepository
    .insert({ name, userId });

  const totalQuestions = allSimulatedSortUser.length + quantityQuestions;

  if (
    (allSimulatedSortUser && allSimulatedSortUser.length === allQuestionsAvailable.length)
    || (quantityQuestions > allQuestionsAvailable.length)
    || (totalQuestions > allQuestionsAvailable.length)
  ) {
    await simulatedRepository.delete(registeredSimulated.id);
    return response.status(400).json({ message: 'Sem questões disponiveis' });
  }

  // Feat: Aplicar sorteio por proporções de categorias disponiveis
  let questionsSorted = [];
  questionsSorted = await sortedQuestions(
    name,
    registeredSimulated,
    quantityQuestions,
    allQuestionsAvailable,
    userId,
  );

  const registerSimulatedQuestions = await simulatedSortQuestionsRepository
    .insertAll(questionsSorted);

  // Refactor: Melhorar validações
  if (!registeredSimulated) {
    return response.status(400).json({ message: 'Não foi possível criar o simulado.' });
  }

  if (!registerSimulatedQuestions) {
    await simulatedRepository.delete({ id: registeredSimulated.id });
    return response.status(400).json({ message: 'Não foi possível sortear as questões' });
  }

  return response.status(201).json(registeredSimulated);
}

async function listSimulated(request, response) {
  const { id } = request.params;

  const simuladosUser = await simulatedRepository.findBy(
    { userId: id },
  );

  return response.status(201).json(simuladosUser);
}

async function answerSimulated(request, response) {
  const { id, altenativeId } = request.body;

  const shortQuestionExits = await simulatedSortQuestionsRepository.findOneBy(
    { id },
  );

  if (!shortQuestionExits) {
    return response.status(400).json({ message: 'Questão não encontrada' });
  }

  const simulatedAnswer = await simulatedSortQuestionsRepository.update({
    id, altenativeId, answered: true,
  });

  if (!simulatedAnswer) {
    return response.status(400).json({ message: 'Não foi possivel responder a questão' });
  }

  return response.status(201).json({ message: 'Questão respondida' });
}

async function consultAnswers(request, response) {
  const { id } = request.params;

  const simulatedQuestions = await simulatedSortQuestionsRepository.findBy({ simulatedId: id });

  if (!simulatedQuestions) {
    return response.status(404).json({ message: 'Simulado não encontrado.' });
  }

  const answers = [];
  for (const simulatedQuestion of simulatedQuestions) {
    const { questionId, altenativeId, answered } = simulatedQuestion;

    const question = await questionRepository.getQuestion(questionId);

    for (const alternative of question.alternatives) {
      alternative.isUserAnswer = false;
      if (altenativeId === alternative.id && answered) {
        alternative.isUserAnswer = true;
      }
    }

    answers.push(question);
  }

  return response.status(200).json(answers);
}

async function getRandomQuestions(request, response) {
  const { simulatedId, userId } = request.params;

  const questions = await simulatedRepository.listRandomQuestions(simulatedId, userId);

  if (!questions) {
    return response.status(400).json({ message: 'Questões não encontradas' });
  }

  response.status(200).json(questions);
}

async function finishSimulated(request, response) {
  // refact: verificar se as questões foram respondidas, caso não retornar para a base de dados.
  const { simulatedId } = request.body;

  const simulated = await simulatedRepository.update(
    { id: simulatedId, active: false },
  );

  if (!simulated) {
    return response.status(400).json({ message: 'Não foi possivel finalizar o simulado' });
  }

  return response.status(200).json({ message: 'Simulado finalizado' });
}

module.exports = {
  createSimulated,
  answerSimulated,
  consultAnswers,
  listSimulated,
  getRandomQuestions,
  finishSimulated,
};
