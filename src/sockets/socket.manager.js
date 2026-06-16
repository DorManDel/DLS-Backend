// src/sockets/socket.manager.js

/*
SOCKET MANAGER :
- place that manages Socket.IO realtime connection
- keeps socket logic outside index.js
- lets controllers emit realtime events later

Flow:
1) Client connects  
2) Socket server catches connection        
3) Server can emit events        
4) Frontend updates without refresh
*/


/* SOCKET INSTANCE - saved here after setup */
let ioInstance = null;


/*
    SETUP SOCKET SERVER
    Connect Socket.IO server events.
        Called from index.js after creating:
        const io = new Server(httpServer, ...)
*/
function setupSocketServer(io) {
    ioInstance = io;

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.emit("server:welcome", {
            message: "Connected to DLS realtime server",
            socketId: socket.id
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}


/*
    EMIT QUESTION CREATED
    Notify all connected clients that a new question was created.
        Used after:
        POST /api/questions
*/
function emitQuestionCreated(question) {
    if (!ioInstance) {
        console.log("Socket.IO is not ready yet");
        return;
    }
    console.log(`Socket emit question:created -> ${question.id}`);
    
    ioInstance.emit("question:created", question);
}


/*
    EXPORTS
    Allow index.js and controllers to use socket functions.
*/
module.exports = {
    setupSocketServer,
    emitQuestionCreated
};