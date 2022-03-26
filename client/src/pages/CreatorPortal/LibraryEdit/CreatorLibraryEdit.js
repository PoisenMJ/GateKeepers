import React, { useEffect, useState, useContext } from 'react';
import './CreatorLibraryEdit.css';
import { FaPlus } from 'react-icons/fa';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import heic2any from 'heic2any';
import Compressor from 'compressorjs';
import { addOutfit } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';

const CreatorLibraryEdit = ({ type }) => {
    const [itemKeys, setItemKeys] = useState([]);
    const [itemValues, setItemValues] = useState([]);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');

    const { username, token } = useContext(AuthContext);

    useEffect(() => {
        var imageInput = document.getElementById("creator-library-edit-image-upload");
        imageInput.onchange = async function(event){
            //compress images    
            var workingFile;
            if(event.target.files[0].type.toLowerCase() === "image/heic"){
                var currentFile = event.target.files[0];
                await heic2any({ blob: currentFile, toType: "image/jpg", quality: 1 }).then((convertedImage) => {
                    var filename = currentFile.name.split('.');
                    workingFile = new File([convertedImage], filename.slice(0,filename.length-1).join('')+'.png', {
                        type: convertedImage.type
                    });
                })
            } else workingFile = event.target.files[0];
            console.log(workingFile);
            new Compressor(workingFile, {
                quality: 0.7,
                success(result){
                    var newFile = new File([result], result.name, {
                        type: result.type
                    });
                    setImage(newFile);
                }
            })
        }
    }, [])

    const sendCreateOutfit = async event => {
        var items = {};
        for(var i = 0; i < itemKeys.length; i++){
            items[itemKeys[i]] = itemValues[i];
        }
        if(items && name && image){
            var res = await addOutfit(username, token, name, items, image);
            if(res.success) Flash("Created", "success");
        } else Flash("Fill out all fields", "dark");
    }

    const addItem = () => {
        var _itemKeys = itemKeys;
        var _itemValues = itemValues;
        if(_itemValues.length > 0 && (!(_itemValues[_itemValues.length-1]) || !(_itemKeys[_itemKeys.length-1]))){
            Flash("Fill out previous before adding new item.", "dark");
        }
        else {
            _itemKeys.push('new item');
            _itemValues.push('');
            setItemKeys([..._itemKeys]);
            setItemValues([..._itemValues]);
        } 
    }
    const deleteItem = (event, index) => {
        var _itemKeys = itemKeys;
        var _itemValues = itemValues;
        _itemKeys.splice(index, 1);
        _itemValues.splice(index, 1);
        setItemKeys([..._itemKeys]);
        setItemValues([..._itemValues]);
    }

    const updateItemKey = (event, index) => {
        var _itemKeys = itemKeys;
        _itemKeys[index] = event.target.value;
        setItemKeys(_itemKeys);
    }
    const updateItemValue = (event, index) => {
        var _itemValues = itemValues;
        _itemValues[index] = event.target.value;
        setItemValues(_itemValues);
    }

    const openImageInput = () => { document.getElementById("creator-library-edit-image-upload").click(); }

    return (
        <div className="d-flex flex-column flex-sm-column flex-md-row flex-lg-row flex-xl-row flex-xxl-row" id="admin-library-outfit-parent">
            <form id="creator-library-edit-form">
                <input type="file" name="outfitImg" className="visually-hidden" id="creator-library-edit-image-upload"/>
            </form>
                <div id="admin-library-outfit-image-parent" onClick={openImageInput}>
                    <span id="admin-library-outfit-image-text">CLICK TO CHANGE</span>
                    <img id="admin-library-outfit-image"
                        src={image ? URL.createObjectURL(image) : "/images/default.jpg"}/>
                </div>
                <div className="d-flex flex-column justify-content-center w-100" id="admin-library-outfit-details-parent">
                    <input className="form-control-lg mb-2" type="text"
                            onChange={event => setName(event.target.value)}
                            placeholder="Name" required/>
                    {itemKeys.length > 0 && itemKeys.map((item, index) => {
                        return (
                            <div className="d-flex admin-library-outfit-detail mb-1" key={index}>
                                <input type="text" className="form-control"
                                        defaultValue={item} placeholder="Piece"
                                        onChange={e => updateItemKey(e, index)}/>
                                <input type="text" className="form-control"
                                        defaultValue={itemValues[index]} placeholder="Where from"
                                        onChange={e => updateItemValue(e, index)}/>
                                <button onClick={e => deleteItem(e, index)}
                                        className="btn btn-danger" type="button">DELETE</button>
                            </div>
                        )
                    })}
                    <button onClick={addItem} className="btn btn-success my-1" type="button">ADD PIECE
                        <FaPlus className="icon-3"/>
                    </button>
                    {type === "add" ?
                        <button onClick={sendCreateOutfit} className="btn btn-dark" type="button">CREATE</button>:
                        <button className="btn btn-dark" type="button">UPDATE</button>
                    }
                </div>
        </div>
    )
}

export default CreatorLibraryEdit;