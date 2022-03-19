const { CategoryRepository } = require("../repositories/CategoryRepository");

const categoryRepository = new CategoryRepository()

const { verifyDuplicatedCategory, clearCategoryObject } = require("../helpers/utils");

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
    const categories = await categoryRepository.findAll();

    return response.status(201).json(categories);
}

async function getCategory(request, response) {
    const { id } = request.params;

    const category = await categoryRepository.findOneBy({ id });

    if (!category) {
        return response.status(404).json({ message: "Categoria não encontrada." });
    }

    const cleanedCategory = clearCategoryObject(category);

    return response.status(201).json(cleanedCategory);
}

async function deleteCategory(request, response) {
    const { id } = request.params;

    const category = await categoryRepository.findOneBy({ id });

    if (!category) {
        return response.status(404).json({ message: "Categoria não encontrada." });
    }

    const deletedCategory = await categoryRepository.delete(id);

    if (!deletedCategory) {
        return response.status(400).json({ message: "Erro ao deletar categoria." });
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
        return response.status(404).json({ message: "Categoria não encontrada." });
    }

    const updatedCategory = await categoryRepository.update({ id, name });

    if (!updatedCategory) {
        return response.status(400).json({ message: "Erro ao atualizar categoria." });
    }

    return response.status(201).json({ message: 'Categoria atualizada com sucesso.' });
}

module.exports = { createCategory, listCategories, getCategory, deleteCategory, updateCategory }