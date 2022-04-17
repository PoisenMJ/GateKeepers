const { Server } = require('socket.io');

module.exports.initialiseSockets = function initialize(app){
    const io = new Server(app, {
        cors: { origin: "https://localhost:3000" }
    });

    io.on('connection', (socket) => {
        console.log("New Connection:");

        socket.on("join_room", (_user_1, _user_2) => {
            console.log(`Joining room: ${_user_1}-${_user_2}`);
            socket.join(`${_user_1}-${_user_2}`);
        })

        socket.on("customs_message", (_user_1, _user_2, _message) => {
            console.log(`Message to room: ${_user_1}-${_user_2}`);
            socket.to(`${_user_1}-${_user_2}`).emit("customs_message", {_user_1, _user_2, _message});
        })
    })
}