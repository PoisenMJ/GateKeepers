import { io } from 'socket.io-client';
import { SOCKET_HOST } from '../config';

const createSocket = () => { return io(SOCKET_HOST); }
const joinRoom = (_socket, _user_1, _user_2) => {
    console.log(`Client joining: ${_user_1}-${_user_2}`)
    _socket.emit("join_room", _user_1, _user_2);
}
const sendMessage = (_socket, _user_1, _user_2, _message) => { _socket.emit("customs_message", _user_1, _user_2, _message); }
const onMessageRecieved = (_socket, _callback) => {
    _socket.on("customs_message", (_user_1, _user_2, _message) => {
        _callback(_user_1, _user_2, _message);
    })
}

export {
    createSocket,
    joinRoom,
    sendMessage,
    onMessageRecieved
}