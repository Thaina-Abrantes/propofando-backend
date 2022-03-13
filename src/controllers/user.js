const { UserRepository } = require("../repositories/UserRepository")
const { validateUser } = require("../helpers/validators/userValidator")

const userRepository = new UserRepository()

async function getUsers(_, response) {
    const users = await userRepository.findAll()

    return response.json(users)
}

async function createUser(request, response) {
    const { fullName, email, password } = request.body;
    
    const indexPassword = email.indexOf("@");
    const defaultPassword = email.substring(0, indexPassword + 1);

    const userWithRegisteredEmail = await (await userRepository.findAll()).find(user => user.email === email);
    
    if(userWithRegisteredEmail) {
        return response.status(400).json({mensagem: "Email já cadastrado."});
    }
    
    const insertedUser = await userRepository.insert({ fullName, email, password: defaultPassword });

    return response.status(201).json({mensagem: "Usuário cadastrado com sucesso." + {insertedUser}});
}

module.exports = { getUsers, createUser }