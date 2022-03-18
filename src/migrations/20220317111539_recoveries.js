const { BaseRepository } = require('@cubos/knex-repository');

exports.up = async function (knex) {
  await BaseRepository.createTable(knex, 'recoveries', (table) => {
    table.uuid('token').notNullable();
    table.uuid('userId').notNullable();
    table.dateTime('expiredAt').notNullable();
    table.foreign('userId').references('id').inTable('users');
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, 'recoveries');
};
