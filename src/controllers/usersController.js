const User = require('../models/User.js');
const { dbConnection } = require('./dbConnection.js');
const func = require('./Funcs/helperFunctions.js');

async function baseConnection(req,res) {
    console.log(`connection to server is being made req: ${req.method} to url:${req.url}`);
    return res.status(200).json({ message: "Users API route working" });
}

/*(POST): getSignupPost(username,password) ----NEEDS TO BE REWRITTEN ONCE DB IS UP! 
    -usage: sending CORRECT data to the db 
    -calledFrom: index.js 
    -calling: DB->createConnection (within Utils = hF -> isRegisterFieldEmpty)
    -exported:Y @getSignupPost
*/
async function getSignupPost(req, res) {
    const { firstName, lastName, email, password, role } = req.body;
    console.log(`getSignupPost called with: ${firstName}, ${lastName},${email}, ${password}, ${role}`); // --- DEBUG LOG ---

    if (func.isregisterFieldEmpty(firstName, lastName, email, password, role)) {
        return res.status(400).json({
            success: false,
            message: "First name, last name, username, and password are required"
        });
    }

    try {

        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            console.log(` email already exists`);
            return res.status(409).json({
                success: false,
                message: `email :  already exists`
            });
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role: role || 'student' // Fallback to 'student' if no role is provided
        });
        await newUser.save();
        console.log(`New user created ${firstName},${lastName}. email: ${email} , with role ${role}`); // ---- DEBUG LOG ----
        return res.status(201).json({
            success: true,
            message: "Account Created Succesfully",
            data: {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
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
    } catch (error) {
        console.error("Error fetching users", error);
        return [];
    }
}



async function removeUser(req, res) {
    /*
    //added by ALEX
    (DELETE): removeUser(userId)
        -usage: Delete a user from the database
        -calledFrom: users.routes.js
        -calling: User.findByIdAndDelete
        -exported: Y
*/
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log(`User ${deletedUser.email} deleted successfully`);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: {
                email: deletedUser.email,
                firstName: deletedUser.firstName,
                lastName: deletedUser.lastName
            }
        });
    } catch (error) {
        console.error("Error deleting user", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


async function getLoginPost(req, res) {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }
    
    try {
        const user = await User.findOne({ email: email });
        
        if (!user || user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error during login", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


function getHealthCheck(req, res) {
    /* getHealthCheck [req, res]
        1. usage: Returns the server health status and environment details.
        2. calledFrom: index.js (GET /api/health)
        3. calling: None
        4. exported: Y
    */
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
    getLoginPost,
    removeUser,
    getHealthCheck,
    baseConnection
};