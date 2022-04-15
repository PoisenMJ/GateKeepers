import React, { useContext, useEffect, useState } from 'react';
import { FaCaretSquareRight, FaPaperPlane } from 'react-icons/fa';
import { getCreator } from '../../../controllers/creators';
import { acceptGatekeeperCustom, declineGatekeeperCustom, getGatekeeperCustomsMessages, markReadCustomsChat, sendCustomsMessage } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';
import "./CreatorCustoms.css";

const CreatorCustoms = () => {
    const { username, token } = useContext(AuthContext);
    const [customs, setCustoms] = useState({});
    const [selectedChat, setSelectedChat] = useState('');
    const [message, setMessage] = useState('');
    const [paymentLink, setPaymentLink] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            var res = await getGatekeeperCustomsMessages(username, token);
            if(res.success){
                setCustoms(res.messages)
                setSelectedChat(Object.keys(res.messages)[0]);
                console.log(res.messages)
            }
            var res1 = await getCreator(username);
            console.log(res1);
            if(res1.success) setPaymentLink(res1.user.paymentLink);
        }
        fetchData();
    }, [])

    const fetchSendMessage = async () => {
        var res = await sendCustomsMessage(username, token, message, selectedChat, "message");
        if(res.success){
            var _messages = customs;
            _messages[selectedChat].messages.push({
                from: username,
                to: selectedChat,
                message: message,
                read: false
            });
            setCustoms({..._messages});
        }
    }

    const sendPaymentLink = async () => {
        var res = await sendCustomsMessage(username, token, paymentLink, selectedChat, "link");
        if(res.success){
            var _messages = customs;
            _messages[selectedChat].messages.push({
                from: username,
                to: selectedChat,
                message: paymentLink,
                read: false,
                type: 'link'
            });
            setCustoms({..._messages});
        }
    }

    const fetchAcceptCustom = async () => {
        var res = await acceptGatekeeperCustom(username, token, selectedChat);
        if(res.success){
            var _messages = customs;
            _messages[selectedChat].accepted = true;
            setCustoms({..._messages});
        }
    }

    const fetchDeclineCustom = async () => {
        var res = await declineGatekeeperCustom(username, token, selectedChat);
        if(res.success){
            var _messages = customs;
            delete _messages[selectedChat];
            setCustoms({..._messages});
        }
    }

    const acceptCustom = (description, price, user) => {
        return (
            <div style={{display: 'grid', height: '100%'}} id="accept-custom">
                <div id="creator-customs-mobile-chat-popout-button" style={{position: 'absolute'}} onClick={toggleInbox}>
                    <FaCaretSquareRight className="fs-1 pointer" style={{color: 'white'}}/>
                </div>
                <div className="text-center" style={{placeSelf: 'center'}}>
                    <span className="text-light fs-2">Accept Custom Project?</span>
                    <br/>
                    <span className="text-muted">{description}</span><br/>
                    <span className="text-danger fs-4">£{price}</span>
                    <div className="button-group w-100 mt-3">
                        <button className="btn btn-danger w-50" onClick={fetchDeclineCustom}>DECLINE</button>
                        <button className="btn btn-success w-50" onClick={fetchAcceptCustom}>ACCEPT</button>
                    </div>
                </div>
            </div>
        )
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
            var _messages = customs;
            for(var i = 0; i < _messages[user].messages.length; i++){
                if(_messages[user].messages[i].from !== username) _messages[user].messages[i].read = true;
            }
            setCustoms({..._messages});
        }
    }

    const selectInboxUser = (user) => {
        setSelectedChat(user);
        resetInboxLayout();
        fetchChatRead(user);
    }

    return (
        <div id="creator-customs">
            <div id="creator-customs-inbox-parent">
                {customs && Object.keys(customs).length > 0 ? Object.keys(customs).map((user, index) => {
                    var msgs = customs[user].messages;
                    var unread_message_count = customs[user].accepted? msgs.filter(x => (x.read === false && x.from !== username)).length : 0;
                    return (
                        <div className={"creator-customs-inbox-item "+((selectedChat===user)&&"active")}
                            onClick={() => selectInboxUser(user)} key={index}>
                            <span className="price fw-bold">£{customs[user].price}</span>
                            <div className="customs-content w-100 pe-2">
                                <div className="d-flex flex-column">
                                    <span>@{user}</span>
                                    <span className={unread_message_count > 0?"fw-bold customs-content-msg":"customs-content-msg"}>{customs[user].accepted?customs[user].messages[customs[user].messages.length-1].message:customs[user].description}</span>
                                </div>
                                {unread_message_count > 0 &&
                                    <span className="badge bg-primary align-self-center ms-auto">{unread_message_count}</span>
                                }
                                {customs[user].accepted === false &&
                                    <span className="badge bg-success align-self-center ms-auto">NEW</span>
                                }
                            </div>
                        </div>
                    )
                }):
                <div className="p-2">
                    <span className="placeholder col-5"></span>
                    <span className="placeholder col-8 me-2"></span>
                    <span className="placeholder col-3"></span>
                    <span className="placeholder col-4 me-2"></span>
                    <span className="placeholder col-7"></span>
                    <span className="placeholder col-4"></span><br/>
                    <span className="placeholder col-4 me-2"></span>
                    <span className="placeholder col-2 me-2"></span>
                    <span className="placeholder col-3 me-2"></span>
                </div>}
            </div>
                {customs && selectedChat &&
                        Object.keys(customs).length > 0 ? (customs[selectedChat].accepted ?
                            <div id="creator-customs-chatbox-parent">
                                <div id="creator-customs-mobile-chat-popout-button" onClick={toggleInbox}>
                                    <FaCaretSquareRight className="fs-1 pointer" style={{color: 'white'}}/>
                                </div>
                                <div id="creator-customs-chatbox">
                                    {customs[selectedChat].messages.map((_message, index) => {
                                        return (
                                            <div className={(_message.from === username)?"creator-customs-message mb-1 right":"creator-customs-message mb-1 left"} key={index}>
                                                {index > 0 ?
                                                    (customs[selectedChat].messages[index-1].from !== _message.from &&
                                                        <span className="text-light creator-customs-message-user">@{_message.from}</span>)
                                                    :
                                                    <span className="text-light creator-customs-message-user">@{_message.from}</span>
                                                }
                                                {_message.type === "link" ?
                                                    <a href={_message.message} target="_blank" className="creator-customs-message-text text-primary">{_message.message}</a>
                                                    :<span className="creator-customs-message-text">{_message.message}</span>
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                                <div id="creator-customs-chatbox-input">
                                    <div className="input-group">
                                        <button className="btn btn-success dropdown-toggle no-box-shadow" type="button" data-bs-toggle="dropdown" aria-expanded="false">ACTIONS</button>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#" onClick={fetchDeclineCustom}>Delete</a></li>
                                            <li><a className="dropdown-item" href="#">Mark Completed</a></li>
                                            <li><hr className="dropdown-divider"/></li>
                                            <li><a className="dropdown-item" onClick={sendPaymentLink} href="#">Send Payment Link</a></li>
                                        </ul>
                                        <input value={message} type="text" className="form-control no-box-shadow" onChange={e => setMessage(e.target.value)}/>
                                        <button onClick={fetchSendMessage} className="input-group-text btn-btn-secondary no-box-shadow"><FaPaperPlane/></button>
                                    </div>
                                </div>
                            </div>
                        :
                        acceptCustom(customs[selectedChat].description, customs[selectedChat].price, selectedChat)
                    ):
                    <div className="w-100 h-100 d-grid">
                        <span className="fs-2 fw-bold" style={{placeSelf: 'center'}}>NO CUSTOM PROJECTS</span>
                    </div>
                }
        </div>
    )
}

export default CreatorCustoms;