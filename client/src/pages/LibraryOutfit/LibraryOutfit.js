import React from 'react';
import './LibraryOutfit.css';

const LibraryOutfitPage = () => {
    return (
        <div className="d-flex flex-column flex-sm-column flex-md-row flex-lg-row flex-xl-row flex-xxl-row h-100" id="library-outfit-parent"><img id="library-outfit-image" src="/images/maksie_aki.gif"/>
            <div className="d-flex flex-column justify-content-center" id="library-outfit-details-parent">
                <div className="d-flex align-items-center library-outfit-detail"><span className="text-nowrap text-uppercase fs-6 fw-bold">T-SHIRT ~&nbsp;</span><span className="text-truncate fs-6">NEVSTUDIO Crabby overflow hello</span></div>
                <div className="fs-6 d-flex align-items-center library-outfit-detail"><span className="text-nowrap text-uppercase fs-6 fw-bold">TROUSERS ~&nbsp;</span><span className="text-truncate fs-6">GATEKEEPERS perform</span></div>
                <div className="fs-6 d-flex align-items-center library-outfit-detail"><span className="text-nowrap text-uppercase fs-6 fw-bold">TROUSERS ~&nbsp;</span><span className="text-truncate fs-6">GATEKEEPERS perform</span></div>
                <div className="fs-6 d-flex align-items-center library-outfit-detail"><span className="text-nowrap text-uppercase fs-6 fw-bold">TROUSERS ~&nbsp;</span><span className="text-truncate fs-6">GATEKEEPERS perform</span></div>
                <div className="fs-6 d-flex align-items-center library-outfit-detail"><span className="text-nowrap text-uppercase fs-6 fw-bold">TROUSERS ~&nbsp;</span><span className="text-truncate fs-6">GATEKEEPERS perform</span></div>
            </div>
        </div>
    )
}

export default LibraryOutfitPage;