import react from 'react';
import './Library.css';

const LibraryPage = () => {
    return (
        <div id="library-parent">
            <div className="row g-0">
                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3">
                    <div className="library-gatekeeper-image-parent">
                        <img className="library-gatekeeper-image" src="/images/maksie_aki.gif"/>
                        <div className="library-gatekeeper-image-text text-center">
                            <span>NEW OUTFIT</span>
                            <br/>
                            <i className="fs-6">Click to view outfit</i>
                        </div>
                        </div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3">
                    <div className="library-gatekeeper-image-parent"><img className="library-gatekeeper-image" src="/images/maksie_aki.gif"/><span className="library-gatekeeper-image-text">Click to view outfit</span></div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3">
                    <div className="library-gatekeeper-image-parent"><img className="library-gatekeeper-image" src="/images/maksie_aki.gif"/><span className="library-gatekeeper-image-text">Click to view outfit</span></div>
                </div>
                <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3">
                    <div className="library-gatekeeper-image-parent"><img className="library-gatekeeper-image" src="/images/maksie_aki.gif"/><span className="library-gatekeeper-image-text">Click to view outfit</span></div>
                </div>
            </div>
        </div>
    )
}

export default LibraryPage;