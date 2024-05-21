const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student_attendance'
}); // Assuming you have a database connection

const getUserByUsername = (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    pool.query(query, [username], (error, results) => {
        if (error) {
            callback({ error: error.message }, null);
            return;
        }
        callback(null, results[0]); // Assuming username is unique, so we return the first result
    });
};

module.exports = { getUserByUsername };
