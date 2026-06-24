require("dotenv").config();

const express = require("express");
const path = require("path"); // ---- DEBUG ----
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { dbConnection } = require('./src/controllers/dbConnection')
const usersRoutes = require("./src/routes/users.routes");
const usersController = require("./src/controllers/usersController");
const questionsRoutes = require("./src/routes/questions.routes");
const socketManager = require("./src/sockets/socket.manager");
// Import the new session routes
const sessionRoutes = require("./src/routes/session.routes");

const app = express();
const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);

app.use(express.json());

app.use(cors({
    origin: 'https://yuutamw.github.io', // Or '*' for testing
    // MUST explicitly allow for custom auth header
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'] 
}));
/* If the client sends form data, please parse it and put it inside req.body */
app.use(express.urlencoded({ extended: true }));


const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

socketManager.setupSocketServer(io);

app.get('/' , async (req,res) => {
    console.log("connection successful");
    return res.status(200).json({
        message: "connection Succes",
        success: true
    });
});


app.get("/api/health", usersController.getHealthCheck);


app.use("/api/users", usersRoutes);

app.use("/api/questions", questionsRoutes);

// Mount session routes (place before the 404 catch‑all)
app.use("/api/sessions", sessionRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        data: {
            method: req.method,
            url: req.originalUrl
        }
    });
});

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err.message);

    res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null
    });

});


dbConnection.createConnection()
    .then(() => {
        // If DB connects successfully
        httpServer.listen(port, () => { 
            console.log(`Server is listening on port ${port} and connected to DB successfully`); 
        });
    })
    .catch((err) => {
        // If DB fails to connect
        console.error("Warning: Starting server without database connection");
        httpServer.listen(port, () => { 
            console.log(`Server is listening on port ${port} (DB Disconnected)`); 
        });
    });