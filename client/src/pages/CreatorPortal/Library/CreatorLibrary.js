import React, { useContext, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import './CreatorLibrary.css';
import { useNavigate } from 'react-router';
import { deleteOutfit, getOutfits } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';

const CreatorLibrary = () => {
    let navigate = useNavigate();
    const { username, token } = useContext(AuthContext);
    const [outfits, setOutfits] = useState([]);
    const [focusedOutfit, setFocusedOutfit] = useState('');

    useEffect(() => {
        const fetchOutfits = async () => {
            var res = await getOutfits(username);
            if(res.success) setOutfits(res.outfits);
        }
        fetchOutfits();
    }, [])

    const sendDeleteOutfit = async outfitID => {
        var res = await deleteOutfit(username, token, outfitID);
        if(res.success){
            var _outfits = [];
            for(var i = 0; i < outfits.length; i++){
                if(outfits[i]._id !== outfitID) _outfits.push(outfits[i]);
            }
            setOutfits(_outfits);
            document.getElementById("creator-library-modal-close").click();
        }
    }

    return (
        <div id="admin-library-parent">
            <div className="modal" tabIndex="-1" id="creator-library-delete-outfit-modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <p>Are you sure you want to delete?</p>
                            <div className="btn-group" role="group">
                                <button id="creator-library-modal-close" data-bs-dismiss="modal" type="button" className="btn btn-danger">NO</button>
                                <button onClick={() => sendDeleteOutfit(focusedOutfit)}
                                    type="button" className="btn btn-success">YES</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-0">
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-4" onClick={() => navigate("/creators/library/add")}>
                    <div className="admin-library-image-parent">
                        <div className="admin-library-image admin-library-add"></div>
                        <span className="admin-library-add-text fs-2">CLICK TO ADD 
                            <FaPlus style={{marginBottom: '8px', marginLeft: '6px'}}/></span>
                    </div>
                </div>
                {outfits.length > 0 && outfits.map((outfit, index) => (
                    <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-4" key={index}>
                        <div className="admin-library-image-parent">
                            <img className="admin-library-image" src={`/images/library/${outfit.image}`}/>
                            <div className="btn-group admin-library-buttons" role="group">
                                <button className="btn btn-primary" type="button">EDIT</button>
                                <button onClick={() => setFocusedOutfit(outfit._id)} data-bs-toggle="modal"
                                        data-bs-target="#creator-library-delete-outfit-modal"
                                        className="btn btn-primary" type="button">DELETE</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CreatorLibrary;