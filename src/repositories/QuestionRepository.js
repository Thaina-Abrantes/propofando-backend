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

    async answeredQuestionCorrectly() {
        const questionAnsweredCorrectly = await knex('users as u')
        .leftJoin('simulated as s', 's.userId', 'u.id')
        .leftJoin('questions_sort_simulated as qss', 'qss.simulatedId', 's.id')
        .leftJoin('alternatives as a', 'a.questionId', 'qss.questionId')
        .select('u.id', 'u.name', 'u.email', 'u.active', 'u.userType', knex.raw('SON_AGG(JSON_BUILD_OBJECT(count(*) filter(where qss.altenativeId = a.id and a.correct = true)) as correctAlternatives'))
        .where({
            'u.userType': 'student',
            'u.active': true,
        })
        .groupBy('u.id', 'qss.userId');

        return questionAnsweredCorrectly;
    }
}

module.exports = { QuestionRepository };
