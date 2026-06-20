const User = require('../models/User.js');
const { dbConnection } = require('./dbConnection.js');
const func  = require('./Funcs/helperFunctions.js');

/*(POST): getSignupPost(username,password) ----NEEDS TO BE REWRITTEN ONCE DB IS UP! 
    -usage: sending CORRECT data to the db 
    -calledFrom: index.js 
    -calling: DB->createConnection (within Utils = hF -> isRegisterFieldEmpty)
    -exported:Y @getSignupPost
*/
async function getSignupPost(req, res) {
    const { firstName, lastName, email, username, password, role } = req.body;
    console.log(`getSignupPost called with: ${firstName}, ${lastName},${email}, ${username},${password}, ${role}`); // --- DEBUG LOG ---

    if (func.isregisterFieldEmpty(firstName, lastName, email, username, password, role)) {
        return res.status(400).json({
            success: false,
            message: "First name, last name, username, and password are required"
        });
    }

    try {
        const existingUsername = await User.findOne({ username: username });
        const existingEmail = await User.findOne({ email: email });
        if (existingUsername || existingEmail) {
            console.log(`Signup failed: Username ${username} or email ${email} already exists`);
            return res.status(409).json({
                success: false,
                message: `${(existingEmail) ? email : username} already exists`
            });
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            password,
            role: role || 'student' // Fallback to 'student' if no role is provided
        });
        await newUser.save();
        console.log(`New user created: ${username} , email: ${email} , with role ${role}`); // ---- DEBUG LOG ----
        return res.status(201).json({
            succes: true,
            message: "Account Created Succesfully",
            data: {
                firstName: newUser.firstName,
                lastName: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Error during signUp ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

/*(GET): getallusers, connects to db ----NEEDS TO BE REWRITTEN ONCE DB IS UP!
    debugging 
    called by index.js ('/getallusers')
*/
async function getallusers() {
    try {
        const users = await User.find({}, '_id firstName lastName email username password role');
        return users;
    } catch(error) {
        console.error("Error fetching users", error);
        return [];
    }
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
        message: "DLS server is running",
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