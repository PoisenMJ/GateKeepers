import React from 'react';
import './CreatorLibraryEdit.css';
import { FaPlus } from 'react-icons/fa';

const CreatorLibraryEdit = ({ type }) => {
    return (
        <div class="d-flex flex-column flex-sm-column flex-md-row flex-lg-row flex-xl-row flex-xxl-row" id="admin-library-outfit-parent">
            <div id="admin-library-outfit-image-parent">
                <span id="admin-library-outfit-image-text">Click to change</span>
                <img id="admin-library-outfit-image" src="/images/maksie_aki.gif"/>
            </div>
            <div class="d-flex flex-column justify-content-center" id="admin-library-outfit-details-parent">
                <div class="d-flex admin-library-outfit-detail">
                    <input type="text" class="form-control" placeholder="Piece"/>
                    <input type="text" class="form-control" placeholder="Where from"/>
                    <button class="btn btn-danger" type="button">DELETE</button>
                </div>
                <button class="btn btn-success my-1" type="button">ADD PIECE
                    <FaPlus className="icon-3"/>
                </button>
                {type === "add" ?
                    <button class="btn btn-dark" type="button">CREATE</button>:
                    <button class="btn btn-dark" type="button">UPDATE</button>
                }
            </div>
        </div>
    )
}

export default CreatorLibraryEdit;