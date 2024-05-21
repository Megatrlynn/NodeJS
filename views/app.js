/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */
const express = require('express');
const bodyParser = require('body-parser');
const studentController = require('../controllers/studentController');
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const app = express();
const port = 3306;

app.use(bodyParser.json());

// Routes
//======================================================================================

//Login Route
app.post('/login', userController.login);

//Route to get users in the db
app.get('/users', authenticateToken, studentController.getAllUsers);

//Routes to interact with the students table in the db
app.get('/students', authenticateToken, studentController.getAllStudents);
app.get('/students/:id', authenticateToken, studentController.getStudentById);
app.post('/students', authenticateToken, studentController.addStudent);
app.put('/students/:id', authenticateToken, studentController.updateStudent);
app.patch('/students/:id', authenticateToken, studentController.partialUpdateStudent);
app.delete('/students/:id', authenticateToken, studentController.deleteStudent);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
