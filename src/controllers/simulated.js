const { SimulatedRepository } = require('../repositories/SimulatedRepository');
// const { QuestionRepository } = require('../repositories/QuestionRepository');

const simulatedRepository = new SimulatedRepository();

// const { verifyDuplicatedCategory, clearCategoryObject } = require('../helpers/utils');

async function createSimulated(request, response) {
  const { name, userId } = request.body;

  await simulatedRepository.insert({ name, userId });

  return response.status(201).json({ message: 'Simulado criado com sucesso.' });
}

// async function listCategories(_, response) {
//   const allCategories = await categoryRepository.findAll();

//   const cleanedCategories = [];

//   for (const category of allCategories) {
//     cleanedCategories.push(clearCategoryObject(category));
//   }

//   return response.status(200).json(cleanedCategories);
// }

module.exports = {
  createSimulated,
  // listCategories,
};
