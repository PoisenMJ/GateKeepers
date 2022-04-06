import React, { useContext, useEffect, useState } from 'react';
import './Library.css';
import { getOutfits } from '../../controllers/gatekeepers';
import { AuthContext } from '../../services/AuthContext';
import { useNavigate } from 'react-router';

const LibraryPage = () => {
    let navigate = useNavigate();
    const { creator } = useContext(AuthContext);
    const [outfits, setOutfits] = useState([]);

    useEffect(() => {
        var fetchOutfits = async () => {
            var res = await getOutfits(creator);
            if(res.success) setOutfits(res.outfits);
        }
    }, [])

    return (
        <div id="library-parent" className='h-100'>
            <div className="row g-0">
                {outfits.length > 0 && outfits.map((outfit, index) => (
                    <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3" key={index}
                            onClick={() => navigate(`/${creator}/library/${outfit.name}`)}>
                        <div className="library-gatekeeper-image-parent">
                            <img className="library-gatekeeper-image" src={`/images/${outfit.image}`}/>
                            <div className="library-gatekeeper-image-text text-center">
                                <span>NEW OUTFIT</span>
                                <br/>
                                <i className="fs-6">Click to view outfit</i>
                            </div>
                            </div>
                    </div>
                ))}
            </div>
            {outfits.length === 0 &&
                <div className="w-100" style={{display: 'grid', height: '100%'}}>
                    <span className="fs-2" style={{placeSelf: 'center'}}>NO OUTFITS</span>
                </div>
            }
        </div>
    )
}

export default LibraryPage;