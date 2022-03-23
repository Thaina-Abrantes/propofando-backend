const { QuestionRepository } = require('../repositories/QuestionRepository');
const { AlternativeRepository } = require('../repositories/AlternativeRepository');

const questionRepository = new QuestionRepository();
const alternativeRepository = new AlternativeRepository();

const { generateTransaction } = require('../helpers/handleTransaction');

async function getQuestion(request, response) {
    const { id } = request.params;

    const question = await questionRepository.getQuestion(id);

    if (!question) {
        return response.status(404).json({ message: 'Questão não encontrada.' });
    }

    return response.status(200).json(question[0]);
}

async function createQuestion(request, response) {
    const { 
        title,
        description, 
        category,
        image,
        explanationVideo,
        explanationText, 
        alternatives,      
    } = request.body;

    const transaction = await generateTransaction();

    const registeredQuestion = await questionRepository
        .withTransaction(transaction)
        .insert({ title, description, category, image, explanationVideo, explanationText});

    for (const alternative of alternatives) {
        alternative.questionId = registeredQuestion.id;
    }

    const registeredAlternatives = await alternativeRepository
        .withTransaction(transaction)
        .insertAll(alternatives);
   
    if(!registeredQuestion || !registeredAlternatives){
        return response.status(400).json({ message: 'Não foi possível cadastrar a questão.' });
    }

    transaction.commit();

    return response.status(201).json({ message: 'Questão cadastrada com sucesso.' });
}

async function deleteQuestion(request, response) {
    const { id } = request.params;

    const existedQuestion = await questionRepository.get(id);

    if (!existedQuestion) {
        return response.status(404).json({ message: 'Questão não encontrada.' });
    }

    const transaction = await generateTransaction();

    const deletedAlternatives = await alternativeRepository
        .withTransaction(transaction)
        .deleteBy({questionId: id});

    const deletedQuestion = await questionRepository
        .withTransaction(transaction)
        .delete(id);

    if (!deletedAlternatives || !deletedQuestion) {
        return response.status(400).json({ message: 'Erro ao deletar questão' });
    }

    transaction.commit();

    return response.status(200).json({ message: 'Questão deletada com sucesso.' });
}

async function updateQuestion(request, response){
    const { id } = request.params;
    const { 
        title,
        description, 
        category,
        image,
        explanationVideo,
        explanationText, 
        alternatives,      
    } = request.body;
    
    const question = await questionRepository.get(id);

    if (!question) {
        return response.status(404).json({ message: 'Questão não encontrada.' });
    }

    const transaction = await generateTransaction();

    const updatedQuestion = await questionRepository
        .withTransaction(transaction)
        .update({id, title, description, category, image, explanationVideo, explanationText});

    if (!updatedQuestion) {
        return response.status(400).json({ message: 'Erro ao atualizar questão.' });
    }

    transaction.commit();

    return response.status(200).json({ message: 'Questão atualizada com sucesso.' });
}

module.exports = {
    getQuestion,
    createQuestion,
    deleteQuestion,
    updateQuestion,
}