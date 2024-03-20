const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// Get all users
exports.getAllUsers = (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        const users = JSON.parse(data);
        res.json(users);
    });
};

// Get user by ID
exports.getUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        const users = JSON.parse(data);
        const user = users.find(user => user.id === userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    });
};

// Create a new user
exports.createUser = (req, res) => {
    const { name, email } = req.body;
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        const users = JSON.parse(data);
        const newUser = { id: users.length + 1, name, email };
        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(201).json(newUser);
        });
    });
};

// Update user by ID
exports.updateUser = (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        const users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        users[userIndex].name = name;
        users[userIndex].email = email;
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.json(users[userIndex]);
        });
    });
};

// Delete user by ID
exports.deleteUser = (req, res) => {
    const userId = parseInt(req.params.id);
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        let users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        users.splice(userIndex, 1);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Internal server error' });
            }
            res.status(204).send();
        });
    });
};
