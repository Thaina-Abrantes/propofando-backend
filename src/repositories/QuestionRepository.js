const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

const { BaseRepository } = require('@cubos/knex-repository');

class QuestionRepository extends BaseRepository {
    constructor() {
        super(knex, 'questions');
    }

    async getQuestion(id) {
        const question = await knex('questions as q')
            .leftJoin('alternatives as a', 'a.questionId', 'q.id')
            .select(
                'q.id',
                'q.title',
                'q.description',
                'q.categoryId',
                'q.image',
                'q.explanationVideo',
                'q.explanationText',
                knex.raw("JSON_AGG(JSON_BUILD_OBJECT('id', a.id, 'option', a.option, 'description', a.description, 'correct', a.correct)) as alternatives"),
            )
            .where('q.id', id)
            .groupBy('q.id')
            .returning('*');

        return question;
    }

    async getQuestions(pageNumber, size, category) {
        pageNumber = pageNumber || 1;
        size = size || 6;

        const rowCount = await knex('questions as q')
            .where((builder) => {
                if (category) {
                    builder.where('q.categoryId', category);
                }
            })
            .count('*');

        const { count } = rowCount[0];

        const numberOfPages = Math.ceil(count / size);

        const page = (pageNumber - 1) * size;

        const questions = await knex('questions as q')
            .leftJoin('alternatives as a', 'a.questionId', 'q.id')
            .select(
                'q.id',
                'q.title',
                'q.description',
                'q.categoryId',
                'q.image',
                'q.explanationVideo',
                'q.explanationText',
                knex.raw("JSON_AGG(JSON_BUILD_OBJECT('id', a.id, 'option', a.option, 'description', a.description, 'correct', a.correct)) as alternatives"),
            )
            .where((builder) => {
                if (category) {
                    builder.where('q.categoryId', category);
                }
            })
            .orderBy('q.title')
            .groupBy('q.id')
            .limit(size)
            .offset(page)
            .returning('*');

        questions.totalItems = count;
        questions.totalPages = numberOfPages >= 1 ? numberOfPages : 1;
        questions.currentPage = parseInt(pageNumber, 10);

        return questions;
    }

    async getTotalUsersAnswered(id) {
        const totalUsersAnswered = await knex('questions_sort_simulated as qsimulated')
            .leftJoin('questions as q', 'q.id', 'qsimulated.questionId')
            .where('qsimulated.questionId', id)
            .andWhere('qsimulated.answered', true)
            .countDistinct('qsimulated.userId')
            .returning('*');

        return totalUsersAnswered[0].count;
    }

    async getAlternativeCorrectOfQuestion(id) {
        const alternative = await knex('questions as q')
            .leftJoin('alternatives as a', 'a.questionId', 'q.id')
            .select('a.*')
            .where('a.questionId', id)
            .andWhere('a.correct', true)
            .returning('*');

        return alternative[0];
    }

    async getAlternativesQuestion(id) {
        const alternatives = await knex('questions as q')
            .leftJoin('alternatives as a', 'a.questionId', 'q.id')
            .select('a.*')
            .where('a.questionId', id)
            .orderBy('a.option')
            .returning('*');

        return alternatives;
    }

    async getTotalAnsweredSuchAlternative(id, alternative, userId) {
        const totalUsersAnswered = await knex('questions_sort_simulated as qsimulated')
            .leftJoin('questions as q', 'q.id', 'qsimulated.questionId')
            .leftJoin('alternatives as a', 'a.id', 'qsimulated.altenativeId')
            .where('qsimulated.questionId', id)
            .where((builder) => {
                if (userId) {
                    builder.where('qsimulated.userId', userId);
                }
            })
            .andWhere('qsimulated.altenativeId', alternative)
            .countDistinct('qsimulated.userId');

        return totalUsersAnswered[0].count;
    }
}

module.exports = { QuestionRepository };
