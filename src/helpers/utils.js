const { UserRepository } = require('../repositories/UserRepository');

const userRepository = new UserRepository();

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

async function passwordEdit(email) {
  const indexPassword = email.indexOf("@");
  const preparedPassword = email.substring(0, indexPassword + 1);

  return preparedPassword;
}

function clearUserObject(user) {
  delete user.password;
  delete user.createdAt;
  delete user.updatedAt;

  return user;
}

module.exports = {
  verifyDuplicatedEmail,
  clearUserObject,
  passwordEdit,
}