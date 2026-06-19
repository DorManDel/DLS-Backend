const { dbConnection } = require('./dbConnection.js');
const { func } = require('./Funcs/helperFunctions.js');

/*(POST): getSignupPost(username,password) ----NEEDS TO BE REWRITTEN ONCE DB IS UP! 
    -usage: sending CORRECT data to the db 
    -calledFrom: index.js 
    -calling: DB->createConnection (within Utils = hF -> isRegisterFieldEmpty)
    -exported:Y @getSignupPost
*/
async function getSignupPost(req, res) {
    const { username, password } = req.body;
    console.log(`getSignupPost called with:, ${username}, ${password}`); // --- DEBUG LOG ---
    
    const userInput = func.isregisterFieldEmpty(username, password);
    if (userInput) { 
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }
        
    const connection = await dbConnection.createConnection();
    try {
        const [existingUsers] = await connection.execute(
            `SELECT * FROM users WHERE username = ?`, 
            [username]
        );
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
        console.log(`New user created: ${username}`); // --- DEBUG LOG ---

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
        console.error("Error during signup:", error); // --- DEBUG LOG ---
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    } finally {
        connection.end();
    };
};

/*(GET): getallusers, connects to db ----NEEDS TO BE REWRITTEN ONCE DB IS UP!
    debugging 
    called by index.js ('/getallusers')
*/
async function getallusers() {
    const connection = await dbConnection.createConnection();
    const [rows] = await connection.execute(`SELECT id, username, role FROM users;`);
    connection.end(); 
    return rows;
}

/* getHealthCheck [req, res]
 1. usage: Returns the server health status and environment details.
 2. calledFrom: index.js (GET /api/health)
 3. calling: None
 4. exported: Y
*/
function getHealthCheck(req, res) {
    const currentPort = process.env.PORT || 3000;
    return res.status(200).json({
        success: true,
        message: "DLS server is running 🏃🏻‍♂️",
        data: {
            port: currentPort,
            environment: process.env.NODE_ENV || "development"
        }
    });
}

module.exports = {
    getallusers,
    getSignupPost,
    getHealthCheck
};