const { UserRepository } = require("../repositories/UserRepository");
const { validateUser } = require("../helpers/validators/userValidator");
const bcrypt = require('bcrypt');

const userRepository = new UserRepository()

async function getUsers(_, response) {
    const users = await userRepository.findAll()

    return response.json(users)
}

async function createUser(request, response) {
    const { fullName, email, password } = request.body;
    
    validateUser({ fullName, email });

    const registeredEmail = await userRepository.findBy({email});

    if (registeredEmail.length !== 0) {
        return response.status(400).json({ mensagem: "Email já cadastrado." });
    }

    const indexPassword = email.indexOf("@");
    const defaultPassword = email.substring(0, indexPassword + 1);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(defaultPassword, salt);

    await userRepository.insert({ fullName, email, password: hash });

    return response.status(201).json({ mensagem: "Usuário cadastrado com sucesso." });
}

module.exports = { getUsers, createUser }