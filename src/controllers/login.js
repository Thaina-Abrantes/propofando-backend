const { UserRepository } = require('../repositories/UserRepository');

const userRepository = new UserRepository();

const { generateToken } = require('../helpers/handleToken');
const { comparePasswords } = require('../helpers/handlePassword');
const { clearUserObject } = require('../helpers/utils');

async function login(request, response) {
  const { email, password } = request.body;

  const registeredUser = await userRepository.findOneBy({ email });

  if (!registeredUser) {
    return response.status(400).json({ message: 'Email e/ou senha informados são inválidos.' });
  }

  const { active, deleted } = registeredUser;

  if (!active || deleted ) {
    return response.status(401).json({ message: 'Contate o administrador do sistema para reativar sua conta.' });
  }

  const verifiedPassword = await comparePasswords(password, registeredUser.password);

  if (!verifiedPassword) {
    return response.status(400).json({ message: 'Email e/ou senha informados são inválidos.' });
  }

  const formattedUser = clearUserObject(registeredUser);

  const token = generateToken({
    id: formattedUser.id,
    email: formattedUser.email,
    userType: formattedUser.userType,
  });

  return response.status(200).json({ user: registeredUser, token });
}

module.exports = { login };
