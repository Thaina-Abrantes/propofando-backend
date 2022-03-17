const { UserRepository } = require("../repositories/UserRepository")

const userRepository = new UserRepository()

const { encryptPassword } = require("../helpers/handlePassword");
const { verifyDuplicatedEmail, passwordEdit } = require("../helpers/utils");

async function getUser(request, response) {
    const { id } = request.params;
    
    const user = await userRepository.findBy(id);

    if (!user) {
        return response.status(404).json({
            success: false, 
            messageError: "Usuário não encontrado."
        });
    }

    const userInfo = user.map(user => [user.name, user.email]);

    return response.status(201).json({ 
        success: true,
        user
    });
}

async function listUsers(_, response) {
    const allUsers = await userRepository.findAll();

    const notDeletedUsers = allUsers.filter(user => user.deleted === false);

    const users = notDeletedUsers.map(user => [user.name, user.email]);
    
    return response.status(201).json({ 
        success: true,
        users
    });
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

    const defaultPassword = await passwordEdit(email);
    
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
    
    const deletedUser = await userRepository.update({id, active:'false', deleted: 'true'});
    
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

async function updateUser(request, response) {
    const { id } = request.params;
    const { name, email, password } = request.body;
    
    const existedUser = await userRepository.get(id);
    
    if (!existedUser) {
        return response.status(404).json({
            success: false, 
            messageError: "Usuário não encontrado."
        });
    }
    
    const registeredEmail = await verifyDuplicatedEmail(email);
    
    if (!registeredEmail.success) {
        return response.status(400).json({
            success: false, 
            messageError: registeredEmail.message 
        });
    }
    
    const defaultPassword = await passwordEdit(email);
    
    const encryptedPassword = await encryptPassword(defaultPassword);
    
    const updatedUser = await userRepository.update({ id, name, email, password: encryptedPassword });
    
    if (!updatedUser) {
        return response.status(400).json({
            success: false, 
            messageError: "Erro ao atualizar usuário."
        });
    }
    
    return response.status(201).json({ 
        success: true,
        message: 'Usuário atualizado com sucesso.'
    });
}

module.exports = { getUser, listUsers, createUser, deleteUser, updateUser }