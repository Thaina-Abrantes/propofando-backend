/* eslint-disable no-await-in-loop */
const { UserRepository } = require('../repositories/UserRepository');
const { CategoryRepository } = require('../repositories/CategoryRepository');
const { SimulatedSortQuestionsRepository } = require('../repositories/SimulatedSortQuestionsRepository');

const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();
const simulatedSortQuestionsRepository = new SimulatedSortQuestionsRepository();

const err = {
  success: true,
  message: '',
};

function generateError(success, message) {
  const erro = {
    success,
    message,
  };

  return erro;
}

async function verifyDuplicatedEmail(email) {
  let error = err;

  const registeredUser = await userRepository.findOneBy({ email });

  if (registeredUser) {
    error = generateError(false, 'Email já cadastrado! Informe um email diferente.');
  }
  return error;
}

async function verifyDuplicatedEmailWithoutMe(id, email) {
  let error = err;

  const registeredUser = await userRepository.findOneBy({ email });

  if (registeredUser && registeredUser.id !== id) {
    error = generateError(false, 'Email já cadastrado! Informe um email diferente.');
  }
  return error;
}

async function passwordEdit(email) {
  const indexPassword = email.indexOf('@');
  const preparedPassword = email.substring(0, indexPassword + 1);

  return preparedPassword;
}

function clearUserObject(user) {
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;
  delete user.deleted;

  return user;
}

function clearCategoryObject(category) {
  delete category.createdAt;
  delete category.updatedAt;

  return category;
}

async function verifyDuplicatedCategory(name) {
  let error = err;

  const registeredCategory = await categoryRepository.findOneBy({ name });

  if (registeredCategory) {
    error = generateError(false, 'Categoria já cadastrada! Informe uma diferente.');
  }
  return error;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function sortedQuestions(
  name,
  registeredSimulated,
  quantityQuestions,
  allQuestionsAvailable,
  userId,
) {
  const questionsSorted = [];

  for (let index = 0; index < quantityQuestions; index += 1) {
    const questionSorted = [];
    const indexQuestionSorted = getRandomInt(0, allQuestionsAvailable.length - 1);

    Object.assign(questionSorted, {
      name,
      simulatedId: registeredSimulated.id,
      userId,
      questionId: allQuestionsAvailable[indexQuestionSorted].id,
      categoryId: allQuestionsAvailable[indexQuestionSorted].categoryId,
    });

    // verificar se não existe questões duplicada antes de efetuar o push
    questionsSorted.push(questionSorted);
  }

  return questionsSorted;
}

function formatInPercentage(number) {
  return number ? `${Math.ceil(number * 100)}%` : `${0}%`;
}

function clearTop3(categories) {
  const categoriesFiltered = categories.filter((category) => (category.totalhits
    ? category.totalhits > 0
    : category.totalincorrects > 0));

  return categoriesFiltered;
}

module.exports = {
  verifyDuplicatedEmail,
  clearUserObject,
  clearCategoryObject,
  passwordEdit,
  verifyDuplicatedEmailWithoutMe,
  verifyDuplicatedCategory,
  getRandomInt,
  sortedQuestions,
  formatInPercentage,
  clearTop3,
};
