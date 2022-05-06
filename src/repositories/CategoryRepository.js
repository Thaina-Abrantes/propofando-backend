const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

const { BaseRepository } = require('@cubos/knex-repository');

class CategoryRepository extends BaseRepository {
    constructor() {
        super(knex, 'category');
    }

    async getCategories(pageNumber, size) {
        pageNumber = pageNumber || 1;
        size = size || 6;

        const rowCount = await knex('category as c')
            .count('*');

        const { count } = rowCount[0];

        const numberOfPages = Math.ceil(count / size);

        const page = (pageNumber - 1) * size;

        const categories = await knex('category as c')
            .select(
                'c.id',
                'c.name',
            )
            .limit(size)
            .offset(page)
            .returning('*');

        categories.totalItems = count;
        categories.totalPages = numberOfPages >= 1 ? numberOfPages : 1;
        categories.currentPage = parseInt(pageNumber, 10);

        return categories;
    }

    async top3Hits(userId) {
        return a;
    }
}
module.exports = { CategoryRepository };
