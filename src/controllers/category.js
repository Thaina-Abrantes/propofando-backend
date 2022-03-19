const { CategoryRepository } = require("../repositories/CategoryRepository");

const categoryRepository = new CategoryRepository()

const { verifyDuplicatedCategory } = require("../helpers/utils");

async function createCategory(request, response) {
    const { name } = request.body;

    const registeredCategory = await verifyDuplicatedCategory(name);

    if (!registeredCategory.success) {
        return response.status(400).json({ message: registeredCategory.message });
    }

    await categoryRepository.insert({ name });
    console.log(name)

    return response.status(201).json({ message: 'Categoria cadastrada com sucesso.' });
}

async function listCategories(_, response) {
    const categories = await categoryRepository.findAll();

    return response.status(201).json(categories);
}

module.exports = { listCategories, createCategory }