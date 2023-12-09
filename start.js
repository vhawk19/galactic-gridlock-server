// start.js

const knex = require('knex')
const knexConfig = require('./knexfile').shared // Adjust this path as needed

const db = knex(knexConfig)

db.migrate
  .latest()
  .then(() => {
    console.log('Database migration completed.')
    // Start your Express app
    require('./app')
  })
  .catch((error) => {
    console.error('Database migration failed:', error)
    process.exit(1)
  })
