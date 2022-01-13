import React, { useEffect, useState, useContext } from 'react';
import { Button, Form, CloseButton } from 'react-bootstrap';
import CurrencyInput from 'react-currency-input-field';
import Carousel from 'nuka-carousel';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import { addProduct } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';
import './Upload.css';

const Upload = () => {
    const [images, setImages] = useState(null);
    const [price, setPrice] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState(null);
    const { username } = useContext(AuthContext);

    const handleInputChange = event => {
        switch(event.target.name){
            case 'name': setName(event.target.value);
            case 'description': setDescription(event.target.value);
            case 'type': setType(event.target.value);
        }
    }

    const openFileInput = () => {
        document.getElementById('image-input').click();
    }

    useEffect(() => {
        var imageInput = document.getElementById('image-input');
        imageInput.onchange = function(event){
            var list = [];
            for(var i = 0; i < event.target.files.length; i++){
                list.push(event.target.files[i]);
            }
            if(images){
                setImages(images.concat(list));
            } else {
                setImages(list);
            }
        }
    })

    const sendAddProduct = async event => {
        event.preventDefault();

        var m = document.getElementById("money-input");
        m.value = m.value.substring(1, m.value.length);
        var formdata = document.getElementById('upload-form');
        
        if(images && price && name && description && type){
            var res = await addProduct(formdata);
            if(res.success) Flash("Successfully added", "success");
            else Flash("Failed", "dark");
        } else {
            Flash("Fill all fields", "dark");
        }
    }

    return (
        <div id="upload">
            <div className="text-center">
                <span className="fs-2">◆ Add Product ◆</span>
            </div>
            <hr className="mb-4"/>
            <Form onSubmit={sendAddProduct} id="upload-form">
                <Form.Control onChange={handleInputChange} name="name" type="text" placeholder="Product Name" className="mb-2 custom-input"/>
                <Form.Control multiple name="images" id="image-input" type="file" className="mb-2 visually-hidden"/>
                <div id="product-images" className="mb-4">
                    <Carousel className="carousel mb-1" width={'100%'} height='100%' dragging>
                        {images ?
                            images.map((image, index) => (
                                <img className="product-upload-image" src={URL.createObjectURL(image)} key={index}/>
                            ))
                            :
                            <img className="product-upload-image" src="/images/default.jpg"/>
                        }
                    </Carousel>
                    <Button onClick={openFileInput} variant="outline-secondary" className="w-100">Add Image</Button>
                </div>
                <CurrencyInput name="price" allowNegativeValue={false} id="money-input" prefix='$' className="custom-input mb-2 w-100" placeholder="Enter Price" decimalsLimit={2} onValueChange={(value, name) => setPrice(value)}/>
                <Form.Control onChange={handleInputChange} name="description" as="textarea" placeholder="Enter description..." className="custom-input mb-2"/>
                <Form.Select onChange={handleInputChange} name="type" className="custom-input mb-2">
                    <option value="made">Own Product</option>
                    <option value="own">Re-Sell</option>
                </Form.Select>
                <Button variant="secondary" type="submit" className="w-100">ADD</Button>
            </Form>
        </div>
    )
}

export default Upload;