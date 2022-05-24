const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);

const { BaseRepository } = require('@cubos/knex-repository');

class UserRepository extends BaseRepository {
    constructor() {
        super(knex, 'users');
    }

    async getUsers(pageNumber, size) {
        pageNumber = pageNumber || 1;
        size = size || 6;

        const rowCount = await knex('users').count('*').where({
        'users.userType': 'student',
        'users.active': true,
        });

        const { count } = rowCount[0];

        const numberOfPages = Math.ceil(count / size);

        const page = (pageNumber - 1) * size;

        const users = await knex('users')
            .select(
                'users.id',
                'users.name',
                'users.email',
                'users.active',
                'users.userType',
            )
            .where({
                'users.userType': 'student',
                'users.active': true,
           })
            .limit(size)
            .offset(page)
            .returning('*');

            users.totalItems = count;
            users.totalPages = numberOfPages >= 1 ? numberOfPages : 1;
            users.currentPage = parseInt(pageNumber, 10);

             return users;
    }

    async getAllUsers() {
        const listAllUsers = await knex('users as u')
        .leftJoin('simulated as s', 's.userId', 'u.id')
        .leftJoin('questions_sort_simulated as qss', 'qss.simulatedId', 's.id')
        .leftJoin('alternatives as a', 'a.questionId', 'qss.questionId')
        .select(
            'u.id',
            'u.name',
            'u.email',
            'u.active',
            'u.userType',
            knex.raw('count(*) filter(where qss."altenativeId"= a.id and a.correct = true) as corrects'),
        )
        .where({
            'u.userType': 'student',
            'u.active': true,
        })
        .groupBy('u.id', 'qss.userId')
        .returning('*');

        return listAllUsers;
    }
}
module.exports = { UserRepository };
