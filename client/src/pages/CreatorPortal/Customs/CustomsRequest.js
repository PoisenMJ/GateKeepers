import React from 'react';
import { FaCaretSquareRight } from 'react-icons/fa';

const CustomsRequest = ({ description, fetchAccept, fetchDecline, price, toggleInbox }) => {
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
                    <button className="btn btn-danger w-50" onClick={fetchDecline}>DECLINE</button>
                    <button className="btn btn-success w-50" onClick={fetchAccept}>ACCEPT</button>
                </div>
            </div>
        </div>
    )
}

export default CustomsRequest;