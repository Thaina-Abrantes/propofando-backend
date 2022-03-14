const { UserRepository } = require("../repositories/UserRepository")

const userRepository = new UserRepository()

async function getUsers(_, response) {
    const users = await userRepository.findAll()

    return response.json(users)
}

async function createUser(request, response) {
    const { name, email, password } = request.body;

    const insertedUser = await userRepository.insert({
        name, email, password
    })

    return response.json(insertedUser);
}

module.exports = { getUsers, createUser }