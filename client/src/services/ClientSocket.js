import { io } from 'socket.io-client';
import { SOCKET_HOST } from '../config';

const createSocket = () => { return io(SOCKET_HOST); }
const joinRoom = (_socket, _user_1, _user_2) => {
    console.log(`Client joining: ${_user_1}-${_user_2}`)
    _socket.emit("join_room", _user_1, _user_2);
}
const joinGeneralRoom = (_socket, _user) => {
    console.log(`Joining general room: ${_user}`);
    _socket.emit("join_creator_room", _user);
}
const sendMessage = (_socket, _user_1, _user_2, _message, _type="message") => {
    _socket.emit("customs_message", _user_1, _user_2, _message, _type);
}
const onMessageRecieved = (_socket, _callback) => {
    _socket.on("customs_message", (_user_1, _user_2, _message, _type) => {
        _callback(_user_1, _user_2, _message, _type);
    })
}
const sendCustomsRequest = (_socket, _user, _creator, _description, _price) => {
    _socket.emit("customs_request", _user, _creator, _description, _price);
}
const onCustomsRequestRecieved = (_socket, _callback) => {
    _socket.on("customs_request", (_user, _creator, _description, _price) => {
        _callback(_user, _creator, _description, _price);
    })
}

export {
    createSocket,
    joinRoom,
    joinGeneralRoom,
    sendMessage,
    onMessageRecieved,
    sendCustomsRequest,
    onCustomsRequestRecieved
}