exports.up = function (knex) {
  return knex.schema.createTable('scores', function (table) {
    table.increments('id').primary()
    table.integer('timestamp').notNullable() // Changed to integer for Unix timestamp
    table.integer('score').notNullable()
    table.string('address', 255).notNullable()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('scores')
}
