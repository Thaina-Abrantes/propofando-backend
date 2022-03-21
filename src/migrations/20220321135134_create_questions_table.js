const { BaseRepository } = require('@cubos/knex-repository');

exports.up = async function (knex) {
  await BaseRepository.createTable(knex, 'questions', (table) => {
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.string('category').notNullable();
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, 'questions');
};
