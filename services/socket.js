const { Server } = require('socket.io');

module.exports.initialiseSockets = function initialize(app) {
  const io = new Server(app, {
    cors: { origin: ['https://localhost:3000', 'http://localhost:2999'] },
  });

  io.on('connection', (socket) => {
    console.log(`New Connection: ${socket.id}`);

    socket.on('join_room', (user1, user2) => {
      console.log(`Joining room: ${user1}-${user2}`);
      socket.join(`${user1}-${user2}`);
    });

    socket.on('join_creator_room', (_user) => {
      console.log(`Joining creator room: ${_user}`);
      socket.join(_user);
    });

    socket.on('customs_message', (user1, user2, _message, _type) => {
      // send to user room and general room if creator not in user room
      console.log(`Message to room: ${user1}-${user2}`);
      socket.to(`${user1}-${user2}`).to(user2).emit('customs_message', user1, user2, _message, _type);
    });

    socket.on('customs_request', (_user, _creator, _description, _price) => {
      console.log(`Customs request from: ${_user}`);
      socket.to(_creator).emit('customs_request', _user, _creator, _description, _price);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnecting: ${socket.id}`);
    });
  });
};
