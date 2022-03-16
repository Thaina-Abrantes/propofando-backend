const { validateToken } = require('../helpers/handleToken');
const { clearUserObject } = require('../helpers/utils');

const { UserRepository } = require('../repositories/UserRepository');

const userRepository = new UserRepository();

async function authentication(request, response, next){
  try {
    const { authorization } = request.headers;

    if (!authorization) {
      return response.status(401).json({
        success: false, 
        messageError:'Autenticação necessária! Por favor efetue o login.'
      });
    }

    const token = authorization.replace('Bearer', '').trim();

    const result = validateToken(token);

    const { id, email, userType } = result;

    const registeredUser = await userRepository.findOneBy({ id, email, userType });

    if (!registeredUser) {
      return response.status(400).json({
        success: false, 
        messageError:'Token inválido!'
      });
    }

    const formattedUser = clearUserObject(registeredUser);

    request.user = formattedUser;

    next();
  } catch (error) {
    return response.status(400).json({
      success: false, 
      messageError:'Erro de autenticação!' 
    });
  }
}

module.exports = authentication;
