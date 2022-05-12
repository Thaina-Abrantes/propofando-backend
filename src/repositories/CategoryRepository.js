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
        .leftJoin('questions_sort_simulated as qss', 'qss.userId', 'u.id')
        .leftJoin('questions as q', 'q.id', 'qss.questionId')
        .leftJoin('category as c', 'c.id', 'q.categoryId')
        .leftJoin('alternatives as a', 'a.id', 'qss.altenativeId')
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

    async numberOfQuestionPerCategory() {
        const questionsOfCategory = await knex('category as c')
        .leftJoin('questions as q', 'q.categoryId', 'c.id')
        .select('c.name').count('*')
        .groupBy('c.id');

        return questionsOfCategory;
    }

    async top3AnsweredCorrectly(userId) {
        const top3Categories = await knex('category as c')
        .leftJoin('questions_sort_simulated as qsimulated', 'qsimulated.categoryId', 'c.id')
        .leftJoin('alternatives as a', 'a.questionId', 'qsimulated.questionId')
        .select(
            'c.id',
            'c.name',
            knex.raw('count(*) filter(where qsimulated.answered = true and qsimulated."altenativeId"= a.id and a.correct = true) as totalHits'),
        )
        .where('qsimulated.userId', userId)
        .groupBy('c.id')
        .orderBy('totalhits', 'desc')
        .orderBy('c.name')
        .limit(3)
        .returning('*');

        return top3Categories;
    }

    async top3AnsweredIncorrectly(userId) {
        const top3Categories = await knex('category as c')
        .leftJoin('questions_sort_simulated as qsimulated', 'qsimulated.categoryId', 'c.id')
        .leftJoin('alternatives as a', 'a.questionId', 'qsimulated.questionId')
        .select(
            'c.id',
            'c.name',
            knex.raw('count(*) filter(where qsimulated.answered = true and qsimulated."altenativeId"= a.id and a.correct = false) as totalIncorrects'),
        )
        .where('qsimulated.userId', userId)
        .groupBy('c.id')
        .orderBy('totalincorrects', 'desc')
        .orderBy('c.name')
        .limit(3)
        .returning('*');

        return top3Categories;
    }
}

module.exports = { CategoryRepository };
