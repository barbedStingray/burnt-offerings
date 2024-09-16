const pg = require('pg');

let pool;

if (process.env.POSTGRES_URL_NO_SSL) {
    console.log('Postgres URL', process.env.POSTGRES_URL_NO_SSL);

    pool = new pg.Pool({
        connectionString: process.env.POSTGRES_URL_NO_SSL,
        ssl: {
            rejectUnauthorized: false
        }
    });
}

else {
    pool = new pg.Pool({
        host: 'localhost',
        port: 5432,
        database: 'burnt_offerings',
    });
    console.log('NOW connecting to local host')
}

module.exports = pool;