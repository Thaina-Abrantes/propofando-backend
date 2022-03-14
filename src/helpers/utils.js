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
      error = generateError(false, 'Informe um email diferente.');
    }
    return error;
}

module.exports = { 
    verifyDuplicatedEmail,
}