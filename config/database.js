const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASS,
    port: process.env.PG_PORT
    });

if (!pool) {
    console.log('Connection error...');
} else {
    console.log('Connected to postgres database:', pool.options.database);
}

module.exports = pool;
