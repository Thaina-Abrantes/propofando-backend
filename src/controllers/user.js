const { UserRepository } = require("../repositories/UserRepository")

const userRepository = new UserRepository()

const { encryptPassword } = require("../helpers/handlePassword");
const { verifyDuplicatedEmail } = require("../helpers/utils");

async function getUsers(_, response) {
    const users = await userRepository.findAll()

    return response.json(users)
}

async function createUser(request, response) {
    const { name, email, password } = request.body;

    const registeredEmail = await verifyDuplicatedEmail(email);

    if (!registeredEmail.success) {
        return response.status(400).json({
            success: false, 
            messageError: registeredEmail.message 
        });
    }

    const indexPassword = email.indexOf("@");
    const defaultPassword = email.substring(0, indexPassword + 1);

    const encryptedPassword = await encryptPassword(defaultPassword);

    await userRepository.insert({ name, email, password: encryptedPassword });

    return response.status(201).json({ 
        success: true,
        mensagem: 'Usuário cadastrado com sucesso.'
    });
}

module.exports = { getUsers, createUser }