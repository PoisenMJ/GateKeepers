import React, { useContext, useEffect, useState } from 'react';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { useParams } from 'react-router';
import { fetchAllCustomsMessages, sendCustomsMessage } from '../../../controllers/users';
import { AuthContext } from '../../../services/AuthContext';
import "./CustomsChat.css";

const CustomsChat = () => {
    const { creator } = useParams();
    const { username, token } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            var res = await fetchAllCustomsMessages(username, token, creator);
            if(res.success) setMessages(res.messages);
        }
        fetchData();
    }, [])

    const fetchSendCustomsMessage = async () => {
        var res = await sendCustomsMessage(username, token, message, creator);
        if(res.success){
            var newMessages = messages;
            newMessages.push({
                message,
                from: username,
                to: creator
            });
            setMessages([...newMessages]);
            setMessage('');
        }
    }

    return (
        <div id="customs-chat">
            <div id="customs-chat-chatbox-parent">
                {messages.length > 0 && messages.map((_message, index) => {
                    var leftOrRight = (_message.from === username) ? "right" : "left";
                    return (
                        <div className={"customs-chat-message-parent mb-1 "+leftOrRight} key={index}>
                            {index > 0 && _message.from !== messages[index-1].from &&
                                <span className="fs-6">@{_message.from}</span>
                            }{ index === 0 && <span className="fs-6">@{_message.from}</span>}
                            <span className="ccmp-message">{_message.message}</span>
                        </div>
                    )
                })}
            </div>
            <div id="customs-chat-chatbox-input-parent">
                <div className="input-group">
                    <span className="input-group-text"><FaPaperclip/></span>
                    <button className="btn input-group-text btn-success btn-lg">PAY</button>
                    <input type="text" className="form-control" value={message}
                        placeholder="Message" onChange={e => setMessage(e.target.value)}/>
                    <button onClick={fetchSendCustomsMessage}
                        className="btn input-group-text btn-secondary"><FaPaperPlane/></button>
                </div>
            </div>
        </div>
    )
}

export default CustomsChat;