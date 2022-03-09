const { BaseRepository } = require("@cubos/knex-repository")

const Knex = require("knex")

exports.up = async function (knex) {
    await BaseRepository.createTable(knex, "users", table => {
        table.text("firstName").notNullable();
        table.text("lastName").notNullable();
        table.integer("age").notNullable();
    });
};

exports.down = async function (knex) {
    await BaseRepository.dropTable(knex, "users");
};
