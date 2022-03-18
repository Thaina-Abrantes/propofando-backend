const { UserRepository } = require("../repositories/UserRepository")

const userRepository = new UserRepository()

const { encryptPassword } = require("../helpers/handlePassword");
const { verifyDuplicatedEmail, passwordEdit, clearUserObject, verifyDuplicatedEmailWithoutMe } = require("../helpers/utils");

async function getUser(request, response) {
    const { id } = request.params;

    const user = await userRepository.findOneBy({ id });

    if (!user) {
        return response.status(404).json({ message: "Usuário não encontrado." });
    }

    const cleanedUser = clearUserObject(user);

    return response.status(201).json(cleanedUser);
}

async function listUsers(_, response) {
    const allUsers = await userRepository.findBy({ deleted: false, userType: 'student' });

    const cleanedUsers = [];

    for (const user of allUsers) {
        cleanedUsers.push(clearUserObject(user));
    }

    return response.status(201).json(cleanedUsers);
}

async function createUser(request, response) {
    const { name, email, password } = request.body;

    const registeredEmail = await verifyDuplicatedEmail(email);

    if (!registeredEmail.success) {
        return response.status(400).json({ message: registeredEmail.message });
    }

    const defaultPassword = await passwordEdit(email);

    const encryptedPassword = await encryptPassword(defaultPassword);

    await userRepository.insert({ name, email, password: encryptedPassword });

    return response.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
}

async function deleteUser(request, response) {
    const { id } = request.params;

    const existedUser = await userRepository.get(id);

    if (!existedUser) {
        return response.status(404).json({ message: "Usuário não encontrado." });
    }

    const deletedUser = await userRepository.update({ id, active: 'false', deleted: 'true' });

    if (!deletedUser) {
        return response.status(400).json({ message: "Erro ao deletar usuário." });
    }

    return response.status(200).json({ message: 'Usuário deletado com sucesso.' });
}

async function updateUser(request, response) {
    const { id } = request.params;
    const { name, email, password } = request.body;

    const existedUser = await userRepository.findOneBy({ id, deleted: false });

    if (!existedUser) {
        return response.status(404).json({ message: "Usuário não encontrado." });
    }

    const registeredEmail = await verifyDuplicatedEmailWithoutMe(id, email);

    if (!registeredEmail.success) {
        return response.status(400).json({ message: registeredEmail.message });
    }

    const defaultPassword = await passwordEdit(email);

    const encryptedPassword = await encryptPassword(defaultPassword);

    const updatedUser = await userRepository.update({ id, name, email, password: encryptedPassword });

    if (!updatedUser) {
        return response.status(400).json({ message: "Erro ao atualizar usuário." });
    }

    return response.status(201).json({ message: 'Usuário atualizado com sucesso.' });
}

module.exports = { getUser, listUsers, createUser, deleteUser, updateUser }