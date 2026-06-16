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
    CREATE PRESENTATION ROOM NAME
    Purpose:
    Build one room name per presentation.

    Ex.:
        presentationId = "demo-presentation"
        roomName = "presentation:demo-presentation"
*/
function createPresentationRoom(presentationId) {
    return `presentation:${presentationId}`;
}

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

        /* WELCOME EVENT = Sent only to the connected client. */
        socket.emit("server:welcome", {
            message: "Connected to DLS realtime server",
            socketId: socket.id
        });


        /*
            JOIN PRESENTATION ROOM
                Client tells server which presentation/lecture it listens to.

            Input:  {presentationId: "demo-presentation"}
        */
        socket.on("presentation:join", (data) => {
            if (!data || !data.presentationId) {
                socket.emit("presentation:error", {
                    message: "presentationId is required"
                });

                return;
            }

            const roomName = createPresentationRoom(data.presentationId);

            socket.join(roomName);

            console.log(`Socket ${socket.id} joined room ${roomName}`);

            socket.emit("presentation:joined", {
                presentationId: data.presentationId,
                roomName
            });
        });


        /* DISCONNECT EVENT = Runs when client disconnects. */
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
    if (!question || !question.presentationId) {
        console.log("Cannot emit question:created - missing presentationId");
        return;
    }

    const roomName = createPresentationRoom(question.presentationId);

    console.log(`Socket emit question:created -> ${question.id} -> ${roomName}`);

    ioInstance.to(roomName).emit("question:created", question);
}


/*
    EXPORTS
    Allow index.js and controllers to use socket functions.
*/
module.exports = {
    setupSocketServer,
    emitQuestionCreated
};

/* 
TEST:
---
open 1 socket: http://localhost:3000/socket-test.html?presentationId=demo-presentation
open 2 socket: http://localhost:3000/socket-test.html?presentationId=other-presentation
---

in POSTMAN:
POST http://localhost:3000/api/questions
{
  "presentationId": "demo-presentation",
  "fileName": "demo.pdf",
  "page": 2,
  "x": 0.42,
  "y": 0.31,
  "text": "Room isolation test",
  "color": "#ff2f6d",
  "studentName": "Anonymous",
  "isAnonymous": true
}

---
demo-presentation tab
    receives question:created

other-presentation tab
    does NOT receive question:created
---
*/