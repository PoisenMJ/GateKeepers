import React from 'react';
import { FaPlus } from 'react-icons/fa';
import './CreatorLibrary.css';
import { useNavigate } from 'react-router';

const CreatorLibrary = () => {
    let navigate = useNavigate();
    return (
        <div id="admin-library-parent">
            <div className="row g-0">
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-4" onClick={() => navigate("/creators/library/add")}>
                    <div className="admin-library-image-parent">
                        <div className="admin-library-image admin-library-add"></div>
                        <span className="admin-library-add-text fs-2">CLICK TO ADD 
                            <FaPlus style={{marginBottom: '8px', marginLeft: '6px'}}/></span>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                    <div className="admin-library-image-parent">
                        <img className="admin-library-image" src="/images/maksie_aki.gif"/>
                        <div className="btn-group admin-library-buttons" role="group">
                            <button className="btn btn-primary" type="button">EDIT</button>
                            <button className="btn btn-primary" type="button">DELETE</button>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                    <div className="admin-library-image-parent">
                        <img className="admin-library-image" src="/images/maksie_aki.gif"/>
                        <div className="btn-group admin-library-buttons" role="group">
                            <button className="btn btn-primary" type="button">EDIT</button>
                            <button className="btn btn-primary" type="button">DELETE</button>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                    <div className="admin-library-image-parent">
                        <img className="admin-library-image" src="/images/maksie_aki.gif"/>
                        <div className="btn-group admin-library-buttons" role="group">
                            <button className="btn btn-primary" type="button">EDIT</button>
                            <button className="btn btn-primary" type="button">DELETE</button>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                    <div className="admin-library-image-parent">
                        <img className="admin-library-image" src="/images/maksie_aki.gif"/>
                        <div className="btn-group admin-library-buttons" role="group">
                            <button className="btn btn-primary" type="button">EDIT</button>
                            <button className="btn btn-primary" type="button">DELETE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatorLibrary;