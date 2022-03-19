const { UserRepository } = require('../repositories/UserRepository');
const { CategoryRepository } = require('../repositories/CategoryRepository');

const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();

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
  
  const registeredUser = await userRepository.findOneBy({ email: email });
  
  if (registeredUser && registeredUser.id !== id) {
    error = generateError(false, 'Email já cadastrado! Informe um email diferente.');
  }
  return error;
}

async function passwordEdit(email) {
  const indexPassword = email.indexOf("@");
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

async function verifyDuplicatedCategory(name) {
  let error = err;

  const registeredCategory = await categoryRepository.findOneBy({name});

  if(registeredCategory) {
    error = generateError(false, 'Categoria já cadastrada! Informe uma diferente.')
  }
  return error;
} 

module.exports = {
  verifyDuplicatedEmail,
  clearUserObject,
  passwordEdit,
  verifyDuplicatedEmailWithoutMe,
  verifyDuplicatedCategory
}