const mysql = require('mysql');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'b9od8ivlahiahfdewixj-mysql.services.clever-cloud.com',
    user: 'u0yup0iyw0x3zkbp',
    password: 'Hu6b1oVSaqRZGAYt6Us1',
    database: 'b9od8ivlahiahfdewixj'
});

exports.getAllStudents = (callback) => {
    pool.query('SELECT * FROM students', (error, results, fields) => {
        if (error) {
            console.error('Error retrieving students:', error);
            callback({ error: error.message });
            return;
        }

        callback(null, results);
    });
};

exports.getStudentById = (id, callback) => {
    const query = 'SELECT * FROM students WHERE id = ?';

    pool.query(query, [id], (error, results) => {
        if (error) {
            callback({ error: error.message });
            return;
        }

        callback(null, results[0]);
    });
};

exports.getAllUsers = (callback) => {
    const query = 'SELECT * FROM users';
    pool.query(query, (error, results) => {
        if (error) {
            callback({ error: error.message });
            return;
        }
        callback(null, results);
    });
};

exports.addStudent = (name, reg_no, username, password, institution_id, callback) => {
    bcrypt.genSalt(10, (saltError, salt) => {
        if (saltError) {
            callback({ error: saltError.message });
            return;
        }

        bcrypt.hash(password, salt, (hashError, hashedPassword) => {
            if (hashError) {
                callback({ error: hashError.message });
                return;
            }

            const studentQuery = 'INSERT INTO students (name, reg_no, institution_id) VALUES (?, ?, ?)';
            pool.query(studentQuery, [name, reg_no, institution_id], (studentError, studentResults, studentFields) => {
                if (studentError) {
                    callback({ error: studentError.message });
                    return;
                }

                const studentId = studentResults.insertId;

                const userQuery = 'INSERT INTO users (username, password, role_id, created_by) VALUES (?, ?, ?, ?)';
                pool.query(userQuery, [username, hashedPassword, 1, 'Admin'], (userError, userResults, userFields) => {
                    if (userError) {
                        callback({ error: userError.message });
                        return;
                    }

                    const userId = userResults.insertId;

                    const updateQuery = 'UPDATE students SET users_id = ? WHERE id = ?';
                    pool.query(updateQuery, [userId, studentId], (updateError, updateResults, updateFields) => {
                        if (updateError) {
                            callback({ error: updateError.message });
                            return;
                        }

                        callback(null, { message: 'Student added successfully' });
                    });
                });
            });
        });
    });
};

exports.updateStudent = (id, name, reg_no, institution_id, role_id, created_by, callback) => {
    const query = 'UPDATE students SET name = ?, reg_no = ?, institution_id = ?, role_id = ?, created_by = ? WHERE id = ?';
    
    pool.query(query, [name, reg_no, institution_id, role_id, created_by, id], (error, results, fields) => {
        if (error) {
            callback({ error: error.message });
            return;
        }

        callback(null, { message: 'Student updated successfully' });
    });
};

exports.partialUpdateStudent = (id, updatedFields, callback) => {
    let query = 'UPDATE students SET ';
    const values = [];
    
    Object.keys(updatedFields).forEach((key, index) => {
        query += `${key} = ?`;
        values.push(updatedFields[key]);
        
        if (index < Object.keys(updatedFields).length - 1) {
            query += ', ';
        }
    });

    query += ' WHERE id = ?';
    values.push(id);

    pool.query(query, values, (error, results, fields) => {
        if (error) {
            callback({ error: error.message });
            return;
        }

        callback(null, { message: 'Student updated successfully' });
    });
};

exports.deleteStudent = (id, callback) => {
    const query = 'DELETE students, users FROM students JOIN users ON students.users_id = users.id WHERE students.id = ?';

    pool.query(query, [id], (error, results, fields) => {
        if (error) {
            callback({ error: error.message });
            return;
        }

        callback(null, { message: 'Student and associated user deleted successfully' });
    });
};
