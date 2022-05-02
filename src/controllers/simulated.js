/* eslint-disable no-plusplus */
const { SimulatedRepository } = require('../repositories/SimulatedRepository');
const { SimulatedSortQuestionsRepository } = require('../repositories/SimulatedSortQuestionsRepository');
const { QuestionRepository } = require('../repositories/QuestionRepository');
const { sortedQuestions } = require('../helpers/utils');

/*  Feat: Responder simulado
const { AlternativeRepository } = require('../repositories/AlternativeRepository');
const alternativeRepository = new AlternativeRepository(); */

const simulatedRepository = new SimulatedRepository();
const simulatedSortQuestionsRepository = new SimulatedSortQuestionsRepository();
const questionRepository = new QuestionRepository();

async function createSimulated(request, response) {
  const { userId, quantityQuestions } = request.body;
  let { name } = request.body;

  let questionsSorted = [];

  // Refactor: Melhorar nome do simulado ()
  if (!name) {
    name = `Simulado ${userId}`;
  }

  // Refactor: Trazer apenas questões diponiveis do usuario
  // Refactor: Trazer apenas questões diponiveis do usuario por categoria escolhida se for o caso
  const allQuestionRepository = await questionRepository.findAll();

  const allSimulatedSortUser = await simulatedSortQuestionsRepository.findBy(
    { userId },
  );

  const registeredSimulated = await simulatedRepository
    .insert({ name, userId });

  // Refactor: melhorar comparativo de questões disponiveis
  if (
    (allSimulatedSortUser && allSimulatedSortUser.length === allQuestionRepository.length)
    || (quantityQuestions > allQuestionRepository.length)
  ) {
    return response.status(400).json({ message: 'Sem questões disponiveis' });
  }

  // Refactor: Não realizar o sorteio quando a quantidade for inferior as questões diponiveis.
  // Feat: Aplicar sorteio por proporções de categorias disponiveis
  questionsSorted = await sortedQuestions(
    name,
    registeredSimulated,
    quantityQuestions,
    allQuestionRepository,
    userId,
  );

  const registerSimulatedQuestions = await simulatedSortQuestionsRepository
    .insertAll(questionsSorted);

  // Refactor: Melhorar validações
  if (!registeredSimulated) {
    return response.status(400).json({ message: 'Não foi possível criar o simulado.' });
  }

  if (!registerSimulatedQuestions) {
    return response.status(400).json({ message: 'Não foi possível sortear as questões' });
  }

  return response.status(201).json({ message: 'Simulado criado com sucesso.' });
}

// Feat: Criar controler para inserir resposta

async function consultAnswers(request, response) {

}

module.exports = {
  createSimulated,
  consultAnswers,
};
