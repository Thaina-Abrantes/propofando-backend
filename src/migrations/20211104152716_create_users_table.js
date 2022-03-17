const { BaseRepository } = require('@cubos/knex-repository');

const Knex = require('knex');

exports.up = async function (knex) {
    
    await BaseRepository.createTable(knex, 'users', table => {
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.string('userType').defaultTo('student');
        table.boolean('active').defaultTo(true);
        table.boolean('deleted').defaultTo(false);
    });
};

exports.down = async function (knex) {
    await BaseRepository.dropTable(knex, 'users');
};
