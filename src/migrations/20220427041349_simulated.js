const { BaseRepository } = require('@cubos/knex-repository');

exports.up = async function (knex) {
  await BaseRepository.createTable(knex, 'simulated', (table) => {
    table.string('name').notNullable();
    table.uuid('userId').notNullable();
    table.boolean('active').defaultTo(true);
    table.foreign('userId').references('id').inTable('users');
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, 'simulated');
};
