
const express = require("express");

const path = require("path");
const cors = require("cors");
require("dotenv").config();

const usersRoutes = require("./src/routes/users.routes");
const usersController = require("./src/controllers/users_controller");
const questionsRoutes = require("./src/routes/questions.routes");
const socketManager = require("./src/sockets/socket.manager");

const http = require("http");
const { Server } = require("socket.io");


const app = express();
const port = process.env.PORT || 3000;

const httpServer = http.createServer(app);

app.use(express.json());

app.use(cors());    

app.use(express.urlencoded({ extended: true }));
// --- /MIDDLEWARE ---

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

socketManager.setupSocketServer(io);

app.use(express.static(path.join(__dirname, "html")));

app.get("/", (req, res) => {

    // later will be a PDF get ;
    res.sendFile(path.join(__dirname, "html", "index.html"));

});

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

app.post('/signup', usersController.getSignupPost);


app.use("/api/users", usersRoutes);
app.use("/api/questions", questionsRoutes); // before 404 

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



httpServer.listen(port, () => {
    console.log(`Server is Running on Port ${port}`);
});

