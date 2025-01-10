const knex = require("knex");

const db = knex({
  client: process.env.PGCLIENT,
  connection: {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
  },
});

module.exports = db;
