const { QuestionRepository } = require('../repositories/QuestionRepository');

const questionRepository = new QuestionRepository();


async function createQuestion(request, response) {
    const { 
        title,
        description, 
        category,       
    } = request.body;

    await questionRepository.insert({ title, description, category});

    return response.status(201).json({ message: 'Questão cadastrada com sucesso.' });
}

module.exports = {
    createQuestion,
}