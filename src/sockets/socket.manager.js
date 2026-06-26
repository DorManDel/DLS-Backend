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
        socket.on("sessionId:join", (data) => {
            if (!data || !data.sessionId) {
                socket.emit("sessionId:error", {
                    message: "sessionId is required"
                });

                return;
            }

            const roomName = createPresentationRoom(data.sessionId);

            socket.join(roomName);

            console.log(`Socket ${socket.id} joined room ${roomName}`);

            socket.emit("userId:joined", {
                sessionId: data.presentationId,
                roomName
            });
        });


        /* DISCONNECT EVENT = Runs when client disconnects. */
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}

module.exports = {
    setupSocketServer,
};

