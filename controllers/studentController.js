const express = require('express');
const router = express.Router();
const studentModel = require('../models/studentModel');

// Route to get all students
exports.getAllStudents = (req, res) => {
    studentModel.getAllStudents((error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving students' });
            return;
        }

        res.json(results);
    });
};

// Route to get a student by ID
exports.getStudentById = (req, res) => {
    const { id } = req.params;

    studentModel.getStudentById(id, (error, student) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving student' });
            return;
        }

        res.json(student);
    });
};

// Route to get all users
exports.getAllUsers = (req, res) => {
    studentModel.getAllUsers((error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error retrieving users' });
            return;
        }
        res.json(results);
    });
};

// Route to add a new student
exports.addStudent = (req, res) => {
    const { name, reg_no, username, password, institution_id } = req.body;

    // Call the model method to add the student
    studentModel.addStudent(name, reg_no, username, password, institution_id, (error, message) => {
        if (error) {
            res.status(500).json({ error: 'Error adding student' });
            return;
        }

        res.json({ message });
    });
};

// Route to update a student
exports.updateStudent = (req, res) => {
    const { id } = req.params;
    const { name, reg_no, institution_id, role_id, created_by } = req.body;

    // Call the model method to update the student
    studentModel.updateStudent(id, name, reg_no, institution_id, role_id, created_by, (error, message) => {
        if (error) {
            res.status(500).json({ error: 'Error updating student' });
            return;
        }

        res.json({ message });
    });
};


// Route to partially update a student
exports.partialUpdateStudent = (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    studentModel.partialUpdateStudent(id, updatedFields, (error, message) => {
        if (error) {
            res.status(500).json({ error: 'Error partially updating student' });
            return;
        }

        res.json({ message });
    });
};

// Route to delete a student
exports.deleteStudent = (req, res) => {
    const { id } = req.params;

    // Call the model method to delete the student and associated user
    studentModel.deleteStudent(id, (error, message) => {
        if (error) {
            res.status(500).json({ error: 'Error deleting student' });
            return;
        }

        res.json({ message });
    });
};
