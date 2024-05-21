// userController.js

const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { generateAccessToken } = require('../utils/authUtils');

const login = (req, res) => {
    const { username, password } = req.body;
    
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Retrieve user from database
    userModel.getUserByUsername(username, async (error, user) => {
        if (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        try {
            // Compare hashed password with the provided password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // Check if password is valid
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Generate access token
            const accessToken = generateAccessToken(user.id);

            // Send access token in response
            res.status(200).json({ accessToken });
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};

module.exports = { login };
