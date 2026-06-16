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
    EMIT TO PRESENTATION ROOM
    Helper function for all question socket events.
    Why❔:
    - create / update / delete all need the same logic:
        1. check socket server exists
        2. check question has presentationId
        3. build room name
        4. emit event only to that room
    keeps the code shorter & cleaner. 
    ( Create + Update + Delete )
*/
function emitToPresentationRoom(eventName, question, payload) {
    if (!ioInstance) {
        console.log("Socket.IO is not ready yet");
        return;
    }

    if (!question || !question.presentationId) {
        console.log(`Cannot emit ${eventName} - missing presentationId`);
        return;
    }

    const roomName = createPresentationRoom(question.presentationId);

    console.log(`Socket emit ${eventName} -> ${question.id} -> ${roomName}`);

    ioInstance.to(roomName).emit(eventName, payload);
}


/*
    EMIT QUESTION CREATED
    Notify clients inside the correct presentation room
    that a new question was created.
        Used after:
        POST /api/questions
    [-] CREATE QUESTION PIPELINE:
    -[1] questions.controller.js       
    -[2] questionsStore.createQuestion()       
    -[3] socketManager.emitQuestionCreated(newQuestion)      
    -[4] socket.manager.js emits: question:created        
    -[5] Only presentation room receives it
*/
function emitQuestionCreated(question) {
    emitToPresentationRoom(
        "question:created",
        question,
        question
    );
}



/*
    EMIT QUESTION UPDATED
    Notify clients inside the correct presentation room
    that a question was updated.
        Used after:
        PUT /api/questions/:id
    [-] UPDATE QUESTION PIPELINE:
    -[1] questions.controller.js       
    -[2] questionsStore.updateQuestion()       
    -[3] if not found -> 404       
    -[4] socketManager.emitQuestionUpdated(updatedQuestion)
    -[5] socket.manager.js emits: question:updated
*/
function emitQuestionUpdated(question) {
    emitToPresentationRoom(
        "question:updated",
        question,
        question
    );
}


/*
    EMIT QUESTION DELETED
    Notify clients inside the correct presentation room
    that a question was deleted.
        Used after:
        DELETE /api/questions/:id
    Note:
    We send:
    - id
    - presentationId
    - deletedQuestion
 ➕ Later the frontend can use id to remove the marker/drawer item.
    
    [-] DELETE QUESTION PIPELINE:
    -[1] questions.controller.js
    -[2] questionsStore.deleteQuestion()
    -[3] if not found -> 404
    -[4] socketManager.emitQuestionDeleted(deletedQuestion)
    -[5] socket.manager.js emits: question:deleted

*/
function emitQuestionDeleted(question) {
    emitToPresentationRoom(
        "question:deleted",
        question,
        {
            id: question.id,
            presentationId: question.presentationId,
            deletedQuestion: question
        }
    );
}


/*
    EXPORTS
    Allow index.js and controllers to use socket functions.
        ⚠️ If a function is not here,
            other files cannot call it through socketManager.
*/
module.exports = {
    setupSocketServer,
    emitQuestionCreated,
    emitQuestionUpdated,
    emitQuestionDeleted
};

/* 
TESTS - COPY&PASTA 
------------------
TEST (Room Isolation):
---
open 1 socket: http://localhost:3000/socket-test.html?presentationId=demo-presentation
open 2 socket: http://localhost:3000/socket-test.html?presentationId=other-presentation
---

in POSTMAN: ( ADD QUESTION TO SPECIFIC FILE[socket])
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

DELETE QUESTION TEST :
DELETE http://localhost:3000/api/questions/QUESTION_ID

---

UPDATE QUESTION TEST:
PUT http://localhost:3000/api/questions/QUESTION_ID
{
  "text": "Updated by room socket test",
  "status": "answered"
}

---


*/