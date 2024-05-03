require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: process.env.POSTGRES_PWD,
  host: "localhost",
  port: process.env.POSTGRES_PORT, // default Postgres port
  database: "postgres",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
