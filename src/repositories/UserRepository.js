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

        const rowCount = await knex('users').count('*').where('users.active', true);

        const { count } = rowCount[0];

        const numberOfPages = Math.ceil(count / size);

        const page = (pageNumber - 1) * size;

        const users = await knex('users')
            .select(
                'users.id',
                'users.name',
                'users.email',
                'users.active',
            )
            .where('users.active', true)
            .limit(size)
            .offset(page)
            .returning('*');

            users.totalItems = count;
            users.totalPages = numberOfPages >= 1 ? numberOfPages : 1;
            users.currentPage = parseInt(pageNumber, 10);

             return users;
    }
}
module.exports = { UserRepository };
