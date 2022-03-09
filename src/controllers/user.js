const { UserRepository } = require("../repositories/UserRepository")
const { validateUser } = require("../helpers/validators/userValidator")

const { EmojiService } = require("../services/emojiService")

const userRepository = new UserRepository()
const emojiService = new EmojiService()

async function getUsers(_, response) {
    const users = await userRepository.findAll()

    return response.json(users)
}

async function createUser(request, response) {
    const { firstName, lastName, age } = request.body;

    validateUser({ firstName, lastName, age })

    const emoji = await emojiService.simulateGetEmoji()

    const insertedUser = await userRepository.insert({ firstName: `${firstName} ${emoji}`, lastName, age })

    return response.json(insertedUser)
}

module.exports = { getUsers, createUser }