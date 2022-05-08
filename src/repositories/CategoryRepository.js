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

    async getCategoryStatistics() {
        const categoryStatistics = await knex('users as u')
        .leftjoin('questions_sort_simulated as qss', 'qss.userId', 'u.id')
        .leftjoin('questions as q', 'q.id', 'qss.questionId')
        .leftjoin('category as c', 'c.id', 'q.categoryId')
        .leftjoin('alternatives as a', 'a.id', 'qss.altenativeId')
        .select(
            'u.id',
            'u.name',
            'c.name',
            knex.raw('count(*) filter(where qss.answered = true ) as answeredPerCategory'),
            knex.raw('count(*) filter (where a.correct = true and a.id = qss."altenativeId" and qss.answered = true) as answeredCorretlyPerCategory'),
        )
        .where({
            'u.active': true,
            'u.userType': 'student',
        })
        .groupBy('c.id', 'u.id');

       return categoryStatistics;
    }
}
module.exports = { CategoryRepository };
