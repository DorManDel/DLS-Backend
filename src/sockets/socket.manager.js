
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
    CREATE SESSION ROOM NAME
    Purpose:
    Build one room name per live session.

    Ex.:
        sessionId = "D71DDE"
        roomName  = "presentation:D71DDE"
*/
function createPresentationRoom(sessionId) {
    return `presentation:${sessionId}`;
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
            JOIN SESSION ROOM
                Client tells server which live session it listens to.

            Input:  { sessionId: "D71DDE" }

            IMPORTANT:
            This event name must match what the frontend emits.
            See js/Api-dls.js -> DLS_SOCKET.joinPresentation():
                socket.emit("presentation:join", { sessionId });
        */
        socket.on("session:join", (data) => {
            if (!data || !data.sessionId) {
                socket.emit("presentation:error", {
                    message: "sessionId is required"
                });

                return;
            }

            const roomName = createPresentationRoom(data.sessionId);

            socket.join(roomName);
            // added debug to see num of users:
            const roomSize =
                ioInstance.sockets.adapter.rooms.get(roomName)?.size || 0;

            console.log(`[SOCKET][JOIN] ${socket.id} joined ${roomName}. roomSize=${roomSize}`);

            console.log(`Socket ${socket.id} joined room ${roomName}`);

            socket.emit("presentation:joined", {
                sessionId: data.sessionId,
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
    EMIT TO SESSION ROOM
    Helper function for all question socket events.
    Why❔:
    - create / update / delete all need the same logic:
        1. check socket server exists
        2. check question has a session code
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

    if (!question || !question.code) {
        console.log(`Cannot emit ${eventName} - missing session code`);
        return;
    }

    const roomName = createPresentationRoom(question.code);

    // ADDED: to advanced debug for test.
    const roomSize =
        ioInstance.sockets.adapter.rooms.get(roomName)?.size || 0;

    console.log(`[SOCKET][EMIT] ${eventName} -> ${question._id} -> ${roomName}. roomSize=${roomSize}`);

    console.log(`Socket emit ${eventName} -> ${question._id} -> ${roomName}`);

    ioInstance.to(roomName).emit(eventName, payload);
}


/*
    EMIT QUESTION CREATED
    Notify clients inside the correct session room
    that a new question was created.
        Used after:
        POST /api/questions
*/
function emitQuestionCreated(question) {
    emitToPresentationRoom("question:created", question, question);
}


/*
    EMIT QUESTION UPDATED
    Notify clients inside the correct session room
    that a question was updated.
        Used after:
        PUT /api/questions/:id
*/
function emitQuestionUpdated(question) {
    emitToPresentationRoom("question:updated", question, question);
}


/*
    EMIT QUESTION DELETED
    Notify clients inside the correct session room
    that a question was deleted.
        Used after:
        DELETE /api/questions/:id
*/
function emitQuestionDeleted(question) {
    emitToPresentationRoom("question:deleted", question, {
        id: question._id,
        code: question.code,
        deletedQuestion: question
    });
}


/*
    EMIT SESSION PARTICIPANTS UPDATED
    Notify clients inside the correct session room that the participant
    list changed (someone joined).

    Used after:
        POST /api/sessions/:code/join   (see sessionController.joinSession)

    The frontend listens via:
        DLS_SOCKET.onSessionParticipantsUpdated(cb)   (see Api-dls.js)
    which subscribes to the `session:participantsUpdated` event name below.
*/
function emitSessionParticipantsUpdated(sessionCode, payload) {
    if (!ioInstance) {
        console.log("Socket.IO is not ready yet");
        return;
    }

    if (!sessionCode) {
        console.log("Cannot emit session:participantsUpdated - missing sessionCode");
        return;
    }

    // Reuse the existing room-name convention: presentation:<code>
    const roomName = createPresentationRoom(sessionCode);

    console.log(`Socket emit session:participantsUpdated -> ${roomName}`);

    ioInstance.to(roomName).emit("session:participantsUpdated", payload);
}

// ADDDED for TErminate session 4 All :
function emitSessionEnded(sessionCode, payload = {}) {
    if (!ioInstance) {
        console.log("Socket.IO is not ready yet");
        return;
    }

    if (!sessionCode) {
        console.log("Cannot emit session:ended - missing session code");
        return;
    }

    const roomName = createPresentationRoom(sessionCode);

    const roomSize =
        ioInstance.sockets.adapter.rooms.get(roomName)?.size || 0;

    console.log(`[SOCKET][EMIT] session:ended -> ${roomName}. roomSize=${roomSize}`);

    ioInstance.to(roomName).emit("session:ended", {
        code: sessionCode,
        endedAt: new Date().toISOString(),
        ...payload
    });
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
    emitQuestionDeleted,
    emitSessionParticipantsUpdated,
    emitSessionEnded
};


