import React, { useState, memo } from 'react';
import { FaPaperPlane, FaCaretSquareRight } from 'react-icons/fa';

const Chatbox = ({ creatorUsername, loading, messages, selectedChat, fetchSend, toggleInbox, children }) => {
    const [message, setMessage] = useState('');

    const getMessageClass = (_from) => {
        if(_from === creatorUsername) return "creator-customs-message mb-1 right"
        else return "creator-customs-message mb-1 left"
    }

    const showUsernameAbove = (_message, _index) => {
        if(_index > 0)
            if(messages[selectedChat][_index-1].from !== _message.from)
                return (<span className="text-light creator-customs-message-user">@{_message.from}</span>)
            else return ""
        else return (<span className="text-light creator-customs-message-user">@{_message.from}</span>)
    }

    const showMessage = (_message) => {
        return _message.type === "link" ?
            <a href={_message.message} target="_blank" className="creator-customs-message-text text-primary">{_message.message}</a>
            :<span className="creator-customs-message-text">{_message.message}</span>
    }

    if(!loading)
        if(Object.keys(messages).length > 0)
            return (
                <div id="creator-customs-chatbox-parent">
                    <div id="creator-customs-mobile-chat-popout-button" onClick={toggleInbox}>
                        <FaCaretSquareRight className="fs-1 pointer" style={{color: 'white'}}/>
                    </div>
                    <div id="creator-customs-chatbox">
                        {messages[selectedChat].map((_message, _index) => (
                            <div className={getMessageClass(_message.from)} key={_index}>
                                {showUsernameAbove(_message, _index)}
                                {showMessage(_message)}
                            </div>
                        ))}
                    </div>
                    <div id="creator-customs-chatbox-input">
                        <div className="input-group">
                            <button className="btn btn-success dropdown-toggle no-box-shadow" type="button" data-bs-toggle="dropdown" aria-expanded="false">ACTIONS</button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Delete</a></li>
                                <li><a className="dropdown-item" href="#">Mark Completed</a></li>
                                <li><hr className="dropdown-divider"/></li>
                                <li><a className="dropdown-item" href="#">Send Payment Link</a></li>
                            </ul>
                            <input value={message} type="text" className="form-control no-box-shadow" onChange={e => setMessage(e.target.value)}/>
                            <button onClick={fetchSend} className="input-group-text btn-btn-secondary no-box-shadow"><FaPaperPlane/></button>
                        </div>
                    </div>
                </div>
            )
        else return (
            <div className="w-100 h-100 d-grid">
                <span className="fs-2 fw-bold" style={{placeSelf: 'center'}}>NO CUSTOM PROJECTS</span>
            </div>
        )
    else
        return <span>LOADING</span>
}

export default memo(Chatbox);