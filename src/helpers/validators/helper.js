const { UserRepository } = require('../../repositories/UserRepository');

const userRepository = new UserRepository();


function joiErrorToJavaScriptError(error) {
    return Error(error.message.replace(/"/g, "'"))
}

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

async function verifyDuplicatedUsers(email) {
    let error = err;
  
    const registeredUser = await userRepository.findOneBy({ email });
  
    if (registeredUser) {
      error = generateError(false, 'Informe um email diferente.');
    }
    return error;
}


module.exports = { 
    joiErrorToJavaScriptError, 
    verifyDuplicatedUsers,
}