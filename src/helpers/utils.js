/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
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
  allQuestionRepository,
  userId,
) {
  const questionsSorted = [];

  for (let index = 0; index < quantityQuestions; index++) {
    const questionSorted = [];
    let indexQuestionSorted = getRandomInt(0, allQuestionRepository.length - 1);
    let newSorted = false;

    let questionSortedExists = await simulatedSortQuestionsRepository.findOneBy(
      { userId, questionId: allQuestionRepository[indexQuestionSorted].id },
    );

    if (questionSortedExists) {
      newSorted = true;
      while (newSorted) {
        indexQuestionSorted = getRandomInt(0, allQuestionRepository.length - 1);

        questionSortedExists = await simulatedSortQuestionsRepository.findOneBy(
          { userId, questionId: allQuestionRepository[indexQuestionSorted].id },
        );

        if (!questionSortedExists && newSorted) {
          newSorted = false;
        }
      }
    }

    Object.assign(questionSorted, {
      name,
      simulatedId: registeredSimulated.id,
      userId,
      questionId: allQuestionRepository[indexQuestionSorted].id,
      categoryId: allQuestionRepository[indexQuestionSorted].categoryId,
    });

    questionsSorted.push(questionSorted);
  }

  return questionsSorted;
}

function clearTop3(categories) {
  const categoriesFiltered = categories.filter((category) => (category.totalhits
    ? category.totalhits > 0
    : category.totalincorrects > 0));
  // for (const category of categories) {
  //   if (category?.totalhits === 0 || category?.totalincorrects === 0) {
  //     delete category;
  //   }
  // }
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
  clearTop3,
};
