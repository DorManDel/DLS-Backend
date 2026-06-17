// index.js

/*
    DLS SERVER - MAIN ENTRY POINT
    This file starts the Express server and connects:
    - External libraries
    - Middleware
    - Static HTML files
    - API routes
    - Server listen

    ---

SERVER PIPELINE:
----------------
POST /api/users
        ↓
users.routes.js
        ↓
users_controller.js
        ↓
users.store.js
        ↓
Response to Postman
*/

// REQ = Load Packages installed w/ npm 
// --- REQUIRE ---
const express = require("express");
/* in certain get - send index via path */
const path = require("path");
const cors = require("cors");
require("dotenv").config();
// --- /REQUIRE ---

// REQ INTERNAL FILES = Load owned routes and controllers
// --- PATH ---
const usersRoutes = require("./src/routes/users.routes");
const usersController = require("./src/controllers/users_controller");
const questionsRoutes = require("./src/routes/questions.routes");
// - for SOCKETS setup (MANAGER):
const socketManager = require("./src/sockets/socket.manager");
// --- /PATH ---

// - for SOCKETS setup:
const http = require("http");
const { Server } = require("socket.io");

// APP CONFIG = create express app and define server port
// --- CONFIG ---
const app = express();
const port = process.env.PORT || 3000;
/* HTTP SERVER - needed for Socket.IO */
const httpServer = http.createServer(app);
// --- /CONFIG ---

// Middleware - runs before routes, prepares REQ for server
// --- MIDDLEWARE ---
/* Allows the server to read JSON body from Postman / frontend fetch. */
app.use(express.json());

/* Allows requests from other domains later, for example frontend <-> backend. */
app.use(cors());    

/* Allows the server to read normal HTML form data. */
app.use(express.urlencoded({ extended: true }));
// --- /MIDDLEWARE ---

/* SOCKET.IO SERVER -- add realtime communication on top of HTTP Server */
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

socketManager.setupSocketServer(io);

/* Static files -- This lets Express serve files from /html - server frontend files from folder */
app.use(express.static(path.join(__dirname, "html")));

/* GET  - HomePage (routes) */
app.get("/", (req, res) => {

    // later will be a PDF get ;
    res.sendFile(path.join(__dirname, "html", "index.html"));

});

/* HEALTH CHECK API - Check if server==alive */
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "DLS server is running 🏃🏻‍♂️",
        data: {
            port: port,
            environment: process.env.NODE_ENV || "development"
        }
    });
});

app.get('/getallusers', async (req, res) => {
    res.status(200).send(await usersController.getallusers());
});

/* POST - must release or will be stuck - must send! -- uses the same controller of users */
app.post("/signup", usersController.createUser);

/* REST API routes */
app.use("/api/users", usersRoutes);
app.use("/api/questions", questionsRoutes); // before 404 

/* 404 - PAGE NOT FOUND -- if no route match -> return clean error 404 */
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

/*
    GLOBAL ERROR HANDLER ⚠️🤚🏻
    Catch server errors and return JSON instead of HTML.

    Example:
    If controller has a bug, client gets clean JSON response.
*/

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err.message);

    res.status(500).json({
        success: false,
        message: "Internal server error",
        data: null
    });
});


/* LISTEN - `${param}` = PORT_NUMBER -- START SERVER : */
// for sockets we use `httpServer.listen(...)`;
httpServer.listen(port, () => {
    console.log(`Server is Running on Port ${port}`);
});

/* HTTP server wraps Express app
    Socket.IO attaches to HTTP server
      HTTP server listens */