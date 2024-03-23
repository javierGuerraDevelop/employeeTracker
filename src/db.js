const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Javiercode12#.',
  database: 'week12db',
});

module.exports = db;
