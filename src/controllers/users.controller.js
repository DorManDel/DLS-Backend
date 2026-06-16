// src/controllers/users.controller.js

/*
CONTROLLER :
- place that get request and decide which response to return
- only manages the operation
[called to X] -> [checked DATA] -> [got STORE/SERVICE request] -> [returned RESPONSE];
*/

const usersStore = require("../data/users.store");

/*
    GET /api/users
    Purpose:
    Return all registered users.
*/
function getUsers(req, res) {
    const users = usersStore.getAllUsers();

    res.status(200).json({
        success: true,
        message: "Users loaded successfully",
        count: users.length,
        data: users
    });
}

/*
    POST /api/users
    Purpose:
    Create a new user.
*/
function createUser(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    const existingUser = usersStore.getUserByUsername(username);

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Username already exists"
        });
    }

    const newUser = usersStore.createUser({ username, password });

    res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: newUser
    });
}

module.exports = {
    getUsers,
    createUser
};