import React, { useEffect, useState, useContext } from 'react';
import { Button, Form, CloseButton, FormText } from 'react-bootstrap';
import CurrencyInput from 'react-currency-input-field';
import Carousel from 'nuka-carousel';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import { addProduct } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext';
import DateTime from 'react-datetime';
import { useNavigate } from 'react-router';
import 'react-datetime/css/react-datetime.css';
import './Upload.css';

const Upload = () => {
    let navigate = useNavigate();
    const [images, setImages] = useState(null);
    const [price, setPrice] = useState(0);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState("made");
    const [count, setCount] = useState(null);
    const [sizes, setSizes] = useState(null);

    const [imageOrder, setImageOrder] = useState([]);
    const { username, token } = useContext(AuthContext);

    const handleInputChange = event => {
        switch(event.target.name){
            case 'name':
                setName(event.target.value);
                break;
            case 'description':
                setDescription(event.target.value);
                break;
            case 'type':
                setType(event.target.value);
                break;
            case 'count':
                setCount(event.target.value);
                break;
            case 'sizes':
                setSizes(event.target.value);
                break;
        }
    }

    const openFileInput = () => document.getElementById('image-input').click();
    const changeImageOrder = (event, index) => {
        var order = imageOrder;
        imageOrder[index] = parseInt(event.target.value)-1;
        setImageOrder([]);
        setImageOrder(order);
    }

    useEffect(() => {
        var imageInput = document.getElementById('image-input');
        imageInput.onchange = function(event){
            var list = [];
            var order = [];
            for(var i = 0; i < event.target.files.length; i++){
                list.push(event.target.files[i]);
                order.push(i);
            }
            setImages(list);
            setImageOrder(order);
        }
    })

    const sendAddProduct = async event => {
        event.preventDefault();
        var formdata = document.getElementById('upload-form');

        // check image re-order has right numbers
        var orderList = [];
        for(var i = 0; i < images.length; i++){
            if(imageOrder[i] <= images.length-1){
                orderList.push(i);
            }
        }
        
        if(orderList.length === images.length){
            if(images && price && name && description && type && count && sizes){
                var res = await addProduct(formdata, username, token, imageOrder);
                if(res.success) {
                    Flash("Successfully added", "success");
                    navigate('../products');
                }
                else Flash("Failed", "dark");
            } else {
                Flash("Fill all fields", "dark");
            }
        } else {
            Flash("Orders invalid", "dark");
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
                <Form.Control multiple id="image-input" name="images" type="file" className="mb-2 visually-hidden"/>
                <div id="product-images" className="mb-2">
                    <Carousel className="carousel mb-3" width={'100%'} height='100%' dragging>
                        {images ?
                            images.map((image, index) => (
                                <img className="product-upload-image" src={URL.createObjectURL(image)} key={index}/>
                            ))
                            :
                            <img className="product-upload-image" src="/images/default.jpg"/>
                        }
                    </Carousel>
                    <Button onClick={openFileInput} variant="secondary" className="w-100 mb-1 radius-zero">Set Images</Button>
                </div>
                <Form.Text>Image Order</Form.Text>
                <div id="image-order" className="mb-2">
                    {imageOrder.length > 0 &&
                        imageOrder.map((order, index) => (
                            <Form.Control className="black-custom-input image-order-element" key={index} type="number" defaultValue={imageOrder[index]+1} onChange={(e) => changeImageOrder(e, index)}/>
                        ))
                    }
                </div>
                <Form.Group>
                    <Form.Text>Price</Form.Text>
                    <CurrencyInput onChange={handleInputChange} name="price" allowNegativeValue={false} id="money-input" prefix='£' className="no-outline custom-input mb-2 w-100" placeholder="Enter Price" decimalsLimit={2} onValueChange={(value, name) => setPrice(value)}/>
                </Form.Group>
                <Form.Control onChange={handleInputChange} name="description" as="textarea" placeholder="Enter description..." className="custom-input mb-2"/>
                <Form.Group>
                    <Form.Text>Product Count</Form.Text>
                    <Form.Control onChange={handleInputChange} name="count" type="number" min="1" placeholder="Number of products" className="custom-input mb-1"/>
                </Form.Group>
                <Form.Group>
                    <Form.Text>Enter Sizes</Form.Text>
                    <Form.Control onChange={handleInputChange} name="sizes" placeholder="'Small, Medium, Large', or '1 Size' ..." className="custom-input mb-2"/>
                </Form.Group>
                <Form.Group>
                    <Form.Text>Type</Form.Text>
                    <Form.Select value={type} onChange={handleInputChange} name="type" className="custom-input">
                        <option value="made">Made To Order</option>
                        <option value="own">Creator's Own</option>
                    </Form.Select>
                </Form.Group>
                <DateTime
                    initialValue={new Date()}
                    closeOnSelect={true}
                    className="mb-2 mt-2 w-100"
                    inputProps={{placeholder: 'Upload Date...',
                                className: "date-input-upload-form",
                                readOnly: true,
                                name: 'dateToPost'
                    }}
                />
                <Button variant="secondary" type="submit" className="w-100">ADD</Button>
            </Form>
        </div>
    )
}

export default Upload;