import React, { useContext, useEffect, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { getCreator } from '../../../controllers/creators';
import { acceptGatekeeperCustom, declineGatekeeperCustom, getGatekeeperCustomsMessages, getPaymentLink, sendCustomsMessage } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';
import "./CreatorCustoms.css";

const CreatorCustoms = () => {
    const { username, token } = useContext(AuthContext);
    const [messages, setMessages] = useState({});
    const [selectedChat, setSelectedChat] = useState('');
    const [message, setMessage] = useState('');
    const [paymentLink, setPaymentLink] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            var res = await getGatekeeperCustomsMessages(username, token);
            if(res.success){
                setMessages(res.messages)
                setSelectedChat(Object.keys(res.messages)[0]);
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
            var _messages = messages;
            _messages[selectedChat].messages.push({
                from: username,
                to: selectedChat,
                message: message,
                read: false
            });
            setMessages({..._messages});
        }
    }

    const sendPaymentLink = async () => {
        var res = await sendCustomsMessage(username, token, paymentLink, selectedChat, "link");
        if(res.success){
            var _messages = messages;
            _messages[selectedChat].messages.push({
                from: username,
                to: selectedChat,
                message: paymentLink,
                read: false,
                type: 'link'
            });
            setMessages({..._messages});
        }
    }

    const fetchAcceptCustom = async () => {
        var res = await acceptGatekeeperCustom(username, token, selectedChat);
        if(res.success){
            var _messages = messages;
            _messages[selectedChat].accepted = true;
            setMessages({..._messages});
        }
    }

    const fetchDeclineCustom = async () => {
        var res = await declineGatekeeperCustom(username, token, selectedChat);
        if(res.success){
            var _messages = messages;
            delete _messages[selectedChat];
            setMessages({..._messages});
        }
    }

    const acceptCustom = (description, price, user) => {
        return (
            <div style={{display: 'grid'}} id="accept-custom">
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

    return (
        <div id="creator-customs">
            <div id="creator-customs-inbox-parent">
                {messages && Object.keys(messages).map((user, index) => {
                    return (
                        <div className={"creator-customs-inbox-item "+((selectedChat===user)&&"active")}
                            onClick={() => setSelectedChat(user)} key={index}>
                            <span className="price fw-bold">£{messages[user].price}</span>
                            <div className="d-flex flex-column customs-content w-100">
                                <span>@{user}</span>
                                <span>{messages[user].messages[messages[user].messages.length-1].message}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
                {messages && selectedChat &&
                        (messages[selectedChat].accepted ?
                            <div id="creator-customs-chatbox-parent">
                                <div id="creator-customs-chatbox">
                                    {messages[selectedChat].messages.map((_message, index) => (
                                        <div className={(_message.from === username)?"creator-customs-message mb-1 right":"creator-customs-message mb-1 left"} key={index}>
                                            {index > 0 ?
                                                (messages[selectedChat].messages[index-1].from !== _message.from &&
                                                    <span className="text-light creator-customs-message-user">@{_message.from}</span>)
                                                :
                                                <span className="text-light creator-customs-message-user">@{_message.from}</span>
                                            }
                                            {_message.type === "link" ?
                                                <a href={_message.message} target="_blank" className="creator-customs-message-text text-primary">{_message.message}</a>
                                                :<span className="creator-customs-message-text">{_message.message}</span>
                                            }
                                        </div>
                                    ))}
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
                        acceptCustom(messages[selectedChat].description, messages[selectedChat].price, selectedChat)
                    )
                }
        </div>
    )
}

export default CreatorCustoms;