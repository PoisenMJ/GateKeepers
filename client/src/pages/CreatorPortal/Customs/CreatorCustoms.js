import React, { useContext, useEffect, useState } from 'react';
import { getCreator } from '../../../controllers/creators';
import { acceptGatekeeperCustom,
        declineGatekeeperCustom,
        getGatekeeperCustomsMessages,
        markReadCustomsChat,
        sendCustomsMessage } from '../../../controllers/gatekeepers';

import { AuthContext } from '../../../services/AuthContext';
import { createSocket,
        joinGeneralRoom,
        joinRoom,
        onCustomsRequestRecieved,
        onMessageRecieved,
        sendMessage } from '../../../services/ClientSocket';

import Chatbox from './Chatbox';
import CustomsRequest from './CustomsRequest';
import Inbox from './Inbox';
import "./CreatorCustoms.css";
import { sortCustoms } from '../../../utils/sorting';


const CreatorCustoms = () => {
    const [socket, setSocket] = useState(null);
    const { username, token } = useContext(AuthContext);
    const [customs, setCustoms] = useState(new Map());
    const [empty, setEmpty] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedChat, setSelectedChat] = useState('');
    const [message, setMessage] = useState('');
    const [paymentLink, setPaymentLink] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            var res = await getGatekeeperCustomsMessages(username, token);
            if(res.success){
                if(! ('message' in res)){
                    var _customs = sortCustoms(res.customs);
                    setCustoms(_customs);
                    setSelectedChat(Array.from(_customs.keys())[0]);
                    // socket join room
                    var _socket = createSocket();
                    joinRoom(_socket, Array.from(_customs.keys())[0], username);
                    joinGeneralRoom(_socket, username);
                    setSocket(_socket);
                    scrollBottomMessages();
                } else setEmpty(true);
            }
            var res1 = await getCreator(username);
            if(res1.success) setPaymentLink(res1.user.paymentLink);
        }
        fetchData();
    }, []);
    
    // when customs and messages are set set loading false
    useEffect(() => {
        if(customs.size > 0){
            setLoading(false);
        } else if(empty) setLoading(false);
    }, [customs, empty]);
    
    useEffect(() => {
        if(socket) joinRoom(socket, selectedChat, username);
    }, [socket, selectedChat])

    const eventMessageRecieved = (_user_1, _user_2, _message, _type) => {
        var _customs = customs;
        _customs.get(_user_1).messages.push({
            from: _user_1,
            to: _user_2,
            message: _message,
            type: _type,
            read: false
        });
        setCustoms(new Map(..._customs));
        scrollBottomMessages();
    }

    const eventCustomsRequestRecieved = (_user, _creator, _description, _price) => {
        var _customs = customs;
        _customs.set(_user, {
            messages: [
                {
                    from: _user,
                    to: _creator,
                    message: _description,
                    read: false
                }
            ],
            description: _description,
            accepted: false,
            price: _price
        });
        setCustoms(new Map(..._customs));
    }

    useEffect(() => {
        if(socket){
            // initialize event subscribers
            onMessageRecieved(socket, eventMessageRecieved);
            onCustomsRequestRecieved(socket, eventCustomsRequestRecieved);
        }
    }, [socket]);

    // scroll to bottom of chatbox element
    const scrollBottomMessages = () => {
        var c = document.getElementById("creator-customs-chatbox");
        if(c) c.scrollTop = c.scrollHeight;
    }

    const fetchSendMessage = async (_message) => {
        var res = await sendCustomsMessage(username, token, _message, selectedChat, "message");
        if(res.success){
            var _customs = customs;
            _customs.get(selectedChat).messages.push({
                from: username,
                to: selectedChat,
                message: _message,
                read: false
            });
            setCustoms(new Map(..._customs));
            setMessage('');
            sendMessage(socket, selectedChat, username, _message);
            scrollBottomMessages();
        }
    }
    
    // not done + do i need it?
    const sendPaymentLink = async () => {
        var res = await sendCustomsMessage(username, token, paymentLink, selectedChat, "link");
        if(res.success){
            var _customs = customs;
            _customs.get(selectedChat).messages.push({
                from: username,
                to: selectedChat,
                message: paymentLink,
                read: false,
                type: 'link'
            });
            setCustoms(new Map(..._customs));
            sendMessage(socket, selectedChat, username, message, 'link');
            scrollBottomMessages();
        }
    }

    const fetchAcceptCustom = async () => {
        var res = await acceptGatekeeperCustom(username, token, selectedChat);
        if(res.success){
            var _customs = customs;
            _customs.get(selectedChat).accepted = true;
            setCustoms(new Map(..._customs));
        }
    }

    const fetchDeclineCustom = async () => {
        var res = await declineGatekeeperCustom(username, token, selectedChat);
        if(res.success){
            var _customs = customs;
            _customs.delete(selectedChat);
            setCustoms(new Map(..._customs));
        }
    }

    const toggleInbox = () => {
        document.getElementById("creator-customs-inbox-parent").classList.toggle("show");
        document.getElementById("creator-customs-mobile-chat-popout-button").classList.toggle("toggled");
        document.getElementById("creator-customs-chatbox").classList.toggle("blur");
    }
    const resetInboxLayout = () => {
        try{
            document.getElementById("creator-customs-inbox-parent").classList.remove("show");
            document.getElementById("creator-customs-mobile-chat-popout-button").classList.remove("toggled");
            document.getElementById("creator-customs-chatbox").classList.remove("blur");
        } catch(err) {  }
    }

    const fetchChatRead = async (user) => {
        var res = await markReadCustomsChat(username, token, user);
        if(res.success){
            var _customs = customs;
            for(var i = 0; i < _customs.get(user).messages.length; i++){
                if(_customs.get(user).messages[i].from !== username) _customs.get(user).messages[i].read = true;
            }
            setCustoms(new Map(..._customs));
        }
    }

    const selectInboxUser = (_user) => {
        setSelectedChat(_user);
        resetInboxLayout();
        // if showing messages send read chat
        if(customs.get(_user).accetped) fetchChatRead(_user);
    }

    const getUnreadMessageCount = (_user) => {
        return customs.get(_user).accepted ?
            customs.get(_user).messages.filter(x => (x.read === false && x.from !== username)).length
            : 0;
    }

    const getActiveUser = (_user) => { return _user === selectedChat }

    return (
        <div id="creator-customs">
            <Inbox inboxRecipients={customs}
                    loading={loading}
                    getUnreadMessageCount={getUnreadMessageCount}
                    selectInboxUser={selectInboxUser}
                    getActiveUser={getActiveUser}/>
            {!loading ?
                !empty ?
                    customs.get(selectedChat).accepted ?
                        <Chatbox creatorUsername={username}
                                    loading={loading}
                                    customs={customs}
                                    selectedChat={selectedChat}
                                    fetchSend={fetchSendMessage}
                                    toggleInbox={toggleInbox}/>:
                        <CustomsRequest description={customs.get(selectedChat).description}
                                        price={customs.get(selectedChat).price}
                                        fetchAccept={fetchAcceptCustom}
                                        fetchDecline={fetchDeclineCustom}
                                        toggleInbox={toggleInbox}/>
                    :
                    <div className='w-100 text-center h-100 d-grid'>
                        <span className="fs-4 fw-bold" style={{placeSelf: 'center'}}>No Messages</span>
                    </div>
                :
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            }
        </div>
    )
}

export default CreatorCustoms;