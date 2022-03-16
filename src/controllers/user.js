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
        message: 'Usuário cadastrado com sucesso.'
    });
}

async function deleteUser(request, response) {
    const { id } = request.params;
    
    const existedUser = await userRepository.get(id);

    if (!existedUser) {
        return response.status(404).json({
            success: false, 
            messageError: "Usuário não encontrado."
        });
    }

    if (!existedUser) {
        return response.status(404).json({
            success: false, 
            messageError: "Usuário não encontrado."
        });
    }
    
    const deletedUser = await userRepository.update({id, status:'deleted'});
    
    if (!deletedUser) {
        return response.status(400).json({
            success: false, 
            messageError: "Erro ao deletar usuário."
        });
    }
    
    return response.status(200).json({ 
        success: true,
        message: 'Usuário deletado com sucesso.'
    });
}

module.exports = { getUsers, createUser, deleteUser }