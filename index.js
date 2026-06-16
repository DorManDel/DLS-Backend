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
users.controller.js
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
const usersController = require("./src/controllers/users.controller");
const questionsRoutes = require("./src/routes/questions.routes");
// --- /PATH ---

// APP CONFIG = create express app and define server port
// --- CONFIG ---
const app = express();
const port = process.env.PORT || 3000;
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


/* LISTEN - `${param}` = PORT_NUMBER -- START SERVER : */
app.listen(port, () => {
    console.log(`Server is Running on Port ${port}`);
});