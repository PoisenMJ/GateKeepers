import React from 'react';
import { FaInstagram, FaTwitch } from 'react-icons/fa';
import "./Contact.css";

const Contact = () => {
    return (
        <div id="contact" className="text-center">
            <span className="fs-1 mb-3">►Contacts◄</span>
            <div className="contacts-parent">
                <span><span className="gray-text">TAG:</span> MAKSIE_AKI</span>
                <span><span className="gray-text">ROLE:</span> Creator</span>
                <div>
                    <span><a className="no-link-decor" href="https://www.instagram.com/maksie_aki">
                        <FaInstagram style={{marginBottom: '3px', marginRight: '6px'}} size={25}/></a></span>
                    <span><a className="no-link-decor" href="https://www.twitch.tv/maksie_aki">
                        <FaTwitch style={{marginBottom: '3px'}} size={25}/></a></span>
                </div>
            </div>
            <div className="contacts-parent">
                <span><span className="gray-text">TAG:</span> FLOMARYLANE</span>
                <span><span className="gray-text">ROLE:</span> Secondary</span>
                <div>
                    <span><a className="no-link-decor" href="https://www.instagram.com/flomarylane">
                        <FaInstagram style={{marginBottom: '3px', marginRight: '6px'}} size={25}/></a></span>
                </div>
            </div>
            {/* <div className="contacts-parent">
                <span><span className="gray-text">TAG:</span> LIFEOFADEADGIRL</span>
                <span><span className="gray-text">ROLE:</span> Senior</span>
                <div>
                    <span><a className="no-link-decor" href="https://www.instagram.com/lifeofadeadgirl">
                        <FaInstagram style={{marginBottom: '3px', marginRight: '6px'}} size={25}/></a></span>
                </div>
            </div> */}
        </div>
    )
}

export default Contact;