// src/controllers/users_controller.js

/*
CONTROLLER :
- place that get request and decide which response to return
- only manages the operation
[called to X] -> [checked DATA] -> [got STORE/SERVICE request] -> [returned RESPONSE];
*/

//const usersStore = require("../data/users.store.js");
const { dbConnection } = require('./dbConnection.js');

// exports.users_controller = { 



/*
    GET /api/users
    Purpose:
    Return all registered users.
*/

    
    async function getallusers() {
        const connection = await dbConnection.createConnection();

        const [rows] = await connection.execute(`SELECT id, username, role FROM users;`);
        connection.end(); // Always close the connection
        return rows;
    }

// }

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
    getallusers,
    createUser,
};