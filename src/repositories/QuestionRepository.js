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
                knex.raw("JSON_AGG(JSON_BUILD_OBJECT('id', a.id, 'description', a.description, 'correct', a.correct)) as alternatives"),
            )
            .where('q.id', id)
            .groupBy('q.id')
            .returning('*');

        return question;
    }

    async getQuestionAvailable(id) {
        const question = await knex('questions as q')
            .leftOuterJoin('questions_sort_simulated as a', 'a.questionId', 'q.id')
            .select(
                'q.id',
                'q.title',
                'q.description',
                'q.categoryId',
                'q.image',
                'q.explanationVideo',
                'q.explanationText',
            )
            .where('a.userId', id)
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
                knex.raw("JSON_AGG(JSON_BUILD_OBJECT('id', a.id, 'description', a.description, 'correct', a.correct)) as alternatives"),
            )
            .where((builder) => {
                if (category) {
                    builder.where('q.categoryId', category);
                }
            })
            .groupBy('q.id')
            .limit(size)
            .offset(page)
            .returning('*');

        questions.totalItems = count;
        questions.totalPages = numberOfPages >= 1 ? numberOfPages : 1;
        questions.currentPage = parseInt(pageNumber, 10);

        return questions;
    }
}

module.exports = { QuestionRepository };
