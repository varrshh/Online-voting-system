const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',     // Use your PostgreSQL username
  host: 'localhost',        // Typically 'localhost' on your local machine
  database: 'voting_db',    // The database you created in PostgreSQL
  password: 'susma',  // The password for your PostgreSQL user
  port: 5433,               // Default port for PostgreSQL
});


module.exports = pool;
