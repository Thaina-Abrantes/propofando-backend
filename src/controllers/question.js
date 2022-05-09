const { QuestionRepository } = require('../repositories/QuestionRepository');
const { AlternativeRepository } = require('../repositories/AlternativeRepository');
const { CategoryRepository } = require('../repositories/CategoryRepository');

const questionRepository = new QuestionRepository();
const alternativeRepository = new AlternativeRepository();
const categoryRepository = new CategoryRepository();

const { generateTransaction } = require('../helpers/handleTransaction');
const { formatInPercentage } = require('../helpers/utils');

async function getQuestion(request, response) {
    const { id } = request.params;

    const question = await questionRepository.getQuestion(id);

    if (!question.length) {
        return response.status(404).json({ message: 'Questão não encontrada.' });
    }

    let { alternatives } = question[0];
    const alternativesOrdened = alternatives.sort((a, b) => {
        if (a.option > b.option) {
            return 1;
        }
            return -1;
    });

    alternatives = alternativesOrdened;

    return response.status(200).json(question[0]);
}

async function listQuestions(request, response) {
    const { page, size, category } = request.query;

    const questions = await questionRepository.getQuestions(page, size, category);

    for (let { alternatives } of questions) {
        const alternativesOrdened = alternatives.sort((a, b) => {
            if (a.option > b.option) {
                return 1;
            }
                return -1;
        });

        alternatives = alternativesOrdened;
    }

    const { totalItems } = questions;
    const { totalPages } = questions;
    const { currentPage } = questions;

    return response.status(200).json({
        totalItems,
        questions,
        totalPages,
        currentPage,
    });
}

async function createQuestion(request, response) {
    const {
        title,
        description,
        categoryId,
        image,
        explanationVideo,
        explanationText,
        alternatives,
    } = request.body;

    const existedCategory = await categoryRepository.get(categoryId);

    if (categoryId && !existedCategory) {
        return response.status(404).json({ message: 'Categoria não encontrada.' });
    }

    const alternativeCorrect = alternatives?.find((element) => element.correct === true);
    if (!alternativeCorrect) {
        return response.status(400).json({ message: 'Por favor, selecione uma alternativa correta' });
    }

    const transaction = await generateTransaction();

    const registeredQuestion = await questionRepository
        .withTransaction(transaction)
        .insert({
 title, description, categoryId, image, explanationVideo, explanationText,
});

    for (const alternative of alternatives) {
        alternative.questionId = registeredQuestion.id;
    }

    const registeredAlternatives = await alternativeRepository
        .withTransaction(transaction)
        .insertAll(alternatives);

    if (!registeredQuestion || !registeredAlternatives) {
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
        .deleteBy({ questionId: id });

    const deletedQuestion = await questionRepository
        .withTransaction(transaction)
        .delete(id);

    if (!deletedAlternatives || !deletedQuestion) {
        return response.status(400).json({ message: 'Erro ao deletar questão' });
    }

    transaction.commit();

    return response.status(200).json({ message: 'Questão deletada com sucesso.' });
}

async function updateQuestion(request, response) {
    const { id } = request.params;
    const {
        title,
        description,
        categoryId,
        image,
        explanationVideo,
        explanationText,
        alternatives,
    } = request.body;

    const existedQuestion = await questionRepository.get(id);

    if (!existedQuestion) {
        return response.status(404).json({ message: 'Questão não encontrada.' });
    }

    if (categoryId) {
        const existedCategory = await categoryRepository.get(categoryId);
        if (!existedCategory) {
            return response.status(404).json({ message: 'Categoria não encontrada.' });
        }
    }

    const transaction = await generateTransaction();

    const updatedQuestion = await questionRepository
        .withTransaction(transaction)
        .update({
            id,
            title,
            description,
            categoryId,
            image,
            explanationVideo,
            explanationText,
        });

    if (!updatedQuestion) {
        return response.status(400).json({ message: 'Erro ao atualizar questão.' });
    }

    for (const alternative of alternatives) {
        const {
            id: alternativeId,
            option,
            description: alternativeDescription,
            correct,
        } = alternative;

        const existedAlternative = await alternativeRepository.findOneBy(
            { id: alternativeId, questionId: id },
        );

        if (!existedAlternative) {
            return response.status(404).json({
                    message: `Alternativa não encontrada para esta questão com o id: ${alternativeId}`,
            });
        }

        const updatedAlternative = await alternativeRepository
            .withTransaction(transaction)
            .update({
                id: alternativeId,
                option,
                description: alternativeDescription,
                correct,
            });

        if (!updatedAlternative) {
            return response.status(400).json({ message: 'Erro ao atualizar alternativa da questão.' });
        }
    }

    transaction.commit();

    return response.status(200).json({ message: 'Questão atualizada com sucesso.' });
}

async function getStatistics(request, response) {
    const { id } = request.params;

    const question = await questionRepository.get(id);

    if (!question) {
        return response.status(404).json({ message: 'Questão não encontrada.' });
    }

    const alternativeCorrect = await questionRepository.getAlternativeCorrectOfQuestion(id);

    const answeredCorrectly = await questionRepository
        .getTotalAnsweredSuchAlternative(id, alternativeCorrect.id);

    const totalUsersAnswers = await questionRepository.getTotalUsersAnswered(id);

    const percentageGeneralHits = formatInPercentage(answeredCorrectly / totalUsersAnswers);

    const alternativesOfQuestion = await questionRepository.getAlternativesQuestion(id);

    for (const alternative of alternativesOfQuestion) {
        const answeredCorrect = await questionRepository
            .getTotalAnsweredSuchAlternative(id, alternative.id);
        alternative.percentageSelectedThis = formatInPercentage(answeredCorrect / totalUsersAnswers);

        delete alternative.createdAt;
        delete alternative.updatedAt;
        delete alternative.description;
        delete alternative.correct;
        delete alternative.questionId;
    }

  return response.status(200).json({ percentageGeneralHits, alternativesOfQuestion });
}

module.exports = {
    getQuestion,
    listQuestions,
    createQuestion,
    deleteQuestion,
    updateQuestion,
    getStatistics,
};
