import React, { useContext, useState, useEffect } from 'react';
import { FaAngleDoubleUp } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import { sendCustomRequest, getUserCustom } from '../../../controllers/users';
import { AuthContext } from '../../../services/AuthContext';
import "./CustomsHome.css";

const CustomsHome = () => {
    let navigate = useNavigate();
    const { creator } = useParams();
    const { username, token, loggedIn } = useContext(AuthContext);
    
    const scrollTop = () => { window.scrollTo(0,0); }
    const scrollToForm = () => { document.getElementById("customs-home-request").scrollIntoView(); }

    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [waitingForAccept, setWaitingForAccept] = useState(false);

    useEffect(() => {
        const asyncFunc = async () => {
            var res = await getUserCustom(username, token, creator);
            // if already made custom request go to chat with creator
            if(res.success){
                if(res.hasCustom && res.accepted) navigate("chat");
                else if(res.hasCustom && !res.accepted) setWaitingForAccept(true);
            }
        }
        asyncFunc();
    }, []);

    const fetchSendCustomRequest = async () => {
        if(!(loggedIn || username || token)) Flash("Need to Login", "dark");
        else
            var res = await sendCustomRequest(username, token, description, price, creator);
            if(res.success) Flash("Custom request sent", "success");
            else Flash(res.message, "dark");
    }

    if(!waitingForAccept)
        return (
            <>
                <div id="customs-home-parent">
                    <h2 className="fs-1 fw-bold">CUSTOMS</h2>
                    <span className="fs-5 mb-4">{creator.toUpperCase()}'s customs page. Send a custom project request with a price quota. Discuss custom project details with the creator,
                        your project may be declined if not suitable for that specific creator.</span>
                    <button onClick={scrollToForm} className="btn btn-lg btn-primary w-50 mx-auto">Request Custom</button>
                </div>
                <div id="customs-home-request">
                    <div className="text-center" id="customs-home-back">
                        <FaAngleDoubleUp className="fs-3"/>
                        <br/>
                        <span className="fs-3 fw-bold" onClick={scrollTop}>BACK</span>
                    </div>
                    <textarea className="form-control mb-2" onChange={e => setDescription(e.target.value)}
                            type="text" id="customs-home-form-description"
                            placeholder="Custom request description..."/>
                    <div className="input-group mb-2">
                        <span className="input-group-text">£</span>
                        <input className="form-control" onChange={e => setPrice(e.target.value)}
                                placeholder="0.00" min="0" step="0.1"
                                type="number" id="customs-home-form-price"/>
                    </div>
                    <button className="btn btn-success w-100" onClick={fetchSendCustomRequest}>SUBMIT REQUEST</button>
                </div>
            </>
        )
    else return (
        <>
            <div style={{width: '100%', height: '100%', display: 'grid', placeContent: 'center', textAlign: 'center'}}>
                <h3 className="fs-2">Waiting For Creator To Accept</h3>
                <span className="fs-4">•••</span>
            </div>
        </>
    )
}

export default CustomsHome;