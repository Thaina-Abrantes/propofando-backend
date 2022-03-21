const { BaseRepository } = require('@cubos/knex-repository');

exports.up = async function (knex) {
  await BaseRepository.createTable(knex, 'questions', (table) => {
    table.string('title').notNullable();
    table.string('description', 1700).notNullable();
    table.string('category').notNullable();
    table.string('image');
    table.string('explanationVideo');
    table.string('explanationText', 1700);
  });
};

exports.down = async function (knex) {
  await BaseRepository.dropTable(knex, 'questions');
};
