const { UserRepository } = require('../repositories/UserRepository');

const userRepository = new UserRepository();

const { generateToken } = require('../helpers/handleToken');
const { comparePasswords } = require('../helpers/handlePassword');
const { clearUserObject } = require('../helpers/utils');

async function login(request, response) {
  const { email, password } = request.body;

  const registeredUser = await userRepository.findOneBy({ email });

  if (!registeredUser) {
    return response.status(400).json({ 
      success: false, 
      messageError:'Email e/ou senha informados são inválidos.'
    });
  }

  const verifiedPassword = await comparePasswords(password, registeredUser.password);

  if (!verifiedPassword ) {
    return response.status(400).json({
      success: false, 
      messageError:'Email e/ou senha informados são inválidos.' 
    });
  }

  const formattedUser = clearUserObject(registeredUser);

  const token = await generateToken({
    id: formattedUser.id,
    name: formattedUser.name,
    userType: formattedUser.userType,
  });

  return response.status(200).json({ success: true, user: registeredUser, token });
}

module.exports = { login };
