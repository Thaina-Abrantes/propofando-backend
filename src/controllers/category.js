const { CategoryRepository } = require('../repositories/CategoryRepository');
const { QuestionRepository } = require('../repositories/QuestionRepository');

const categoryRepository = new CategoryRepository();
const questionRepository = new QuestionRepository();

const { verifyDuplicatedCategory, clearCategoryObject } = require('../helpers/utils');

async function createCategory(request, response) {
    const { name } = request.body;

    const registeredCategory = await verifyDuplicatedCategory(name);

    if (!registeredCategory.success) {
        return response.status(400).json({ message: registeredCategory.message });
    }

    await categoryRepository.insert({ name });

    return response.status(201).json({ message: 'Categoria cadastrada com sucesso.' });
}

async function listCategories(_, response) {
    const allCategories = await categoryRepository.findAll();

    const cleanedCategories = [];

    for (const category of allCategories) {
        cleanedCategories.push(clearCategoryObject(category));
    }

    return response.status(200).json(cleanedCategories);
}

async function listCategoriesPaginated(request, response) {
    const { page, size } = request.query;

    const categories = await categoryRepository.getCategories(page, size);

    for (const category of categories) {
        const { id } = category;
        const questionsAssociateds = await questionRepository.findBy({ categoryId: id });

        category.totalQuestions = questionsAssociateds.length;
    }

    const totalCategories = categories.totalItems;
    const { totalPages } = categories;
    const { currentPage } = categories;

    return response.status(200).json({
        totalCategories,
        categories,
        totalPages,
        currentPage,
    });
}

async function getCategory(request, response) {
    const { id } = request.params;

    const category = await categoryRepository.findOneBy({ id });

    if (!category) {
        return response.status(404).json({ message: 'Categoria não encontrada.' });
    }

    const cleanedCategory = clearCategoryObject(category);

    return response.status(200).json(cleanedCategory);
}

async function deleteCategory(request, response) {
    const { id } = request.params;

    const category = await categoryRepository.findOneBy({ id });

    if (!category) {
        return response.status(404).json({ message: 'Categoria não encontrada.' });
    }
    const questionsAssociateds = await questionRepository.findBy({ categoryId: id });

    if (questionsAssociateds.length > 0) {
        return response.status(400).json({ message: 'Não é possível deletar categorias com questões cadastradas!' });
    }
    const deletedCategory = await categoryRepository.delete(id);

    if (!deletedCategory) {
        return response.status(400).json({ message: 'Erro ao deletar categoria.' });
    }

    return response.status(200).json({ message: 'Categoria deletada com sucesso.' });
}

async function updateCategory(request, response) {
    const { id } = request.params;
    const { name } = request.body;

    const registeredCategory = await verifyDuplicatedCategory(name);

    if (!registeredCategory.success) {
        return response.status(400).json({ message: registeredCategory.message });
    }

    const category = await categoryRepository.findOneBy({ id });

    if (!category) {
        return response.status(404).json({ message: 'Categoria não encontrada.' });
    }

    const updatedCategory = await categoryRepository.update({ id, name });

    if (!updatedCategory) {
        return response.status(400).json({ message: 'Erro ao atualizar categoria.' });
    }

    return response.status(200).json({ message: 'Categoria atualizada com sucesso.' });
}

module.exports = {
    createCategory,
    listCategories,
    listCategoriesPaginated,
    getCategory,
    deleteCategory,
    updateCategory,
};
