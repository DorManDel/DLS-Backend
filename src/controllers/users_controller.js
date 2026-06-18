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



/*
    POST /api/users
    Purpose:
    Create a new user.
*/
async function getSignupPost(req, res) {
    const { username, password } = req.body;
    console.log(`getSignupPost called with:, ${username}, ${password}`);
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    const connection = await dbConnection.createConnection();
    try {
        // Check if user exists (execute returns [rows])
        const [existingUsers] = await connection.execute(
            `SELECT * FROM users WHERE username = ?`, 
            [username]
        );

        // If the array has any items, the user exists
        if (existingUsers.length > 0) {
            connection.end();
            console.log(`Signup failed: Username ${username} already exists`); // --- DEBUG LOG ---
            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }

        const [newUser] = await connection.execute(
            `INSERT INTO users (username, password, role) VALUES (?, ?, 'student')`, 
            [username, password]
        );

        console.log(`New user created: ${username}`);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                username: username,
                password: password,
                role: 'student'
            }
        });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    } finally {
        connection.end();
    };
};

module.exports = {
    getallusers,
    // createUser,
    getSignupPost
};