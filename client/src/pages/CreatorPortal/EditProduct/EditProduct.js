import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProduct, updateProduct } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext.js';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import Carousel from 'nuka-carousel';
import DateTime from 'react-datetime';
import { Desktop, Mobile } from '../../../components/Query';
import Compressor from 'compressorjs';
import heic2any from 'heic2any';
import './EditProduct.css';

const EditProduct = () => {
    var {productID} = useParams();
    const [product, setProduct] = useState(null);
    const { username, token } = useContext(AuthContext);
    const [images, setImages] = useState([]);
    const [cleared, setCleared] = useState(false);
    const [imageOrder, setImageOrder] = useState([]);
    const [customSize, setCustomSize] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            var data = await getProduct(productID, username, token);
            setProduct(data.product);
            setImages(data.product.images);
            setImageOrder(data.product.imageOrder);
            setCustomSize(data.product.customSize);
        }
        fetch();

        var imageInput = document.getElementById('creator-portal-image-input');
        imageInput.onchange = function(event){
            var list = [];
            var order = [];
            for(var i = 0; i < event.target.files.length; i++){
                //compress images
                if(i <= 10){
                    if(event.target.files[i].type.toLowerCase() === "image/heic"){
                        var currentFile = event.target.files[i];
                        heic2any({ blob: currentFile, toType: "image/jpg", quality: 0.75 }).then((convertedImage) => {
                            var newFile = new File([convertedImage], currentFile.name, {
                                type: convertedImage.type
                            });
                            list.push(newFile);
                            setImages([]);
                            if(i === event.target.files.length){
                                setImages(list);
                            }
                        })
                    } else {
                        new Compressor(event.target.files[i], {
                            quality: 0.7,
                            success(result){
                                var newFile = new File([result], result.name, {
                                    type: result.type
                                });
                                list.push(newFile);
                                setImages([]);
                                if(i === event.target.files.length){
                                    setImages(list);
                                }
                            }
                        })
                    }
                    order.push(i);
                } else break;
            }
            setImages(list);
            setCleared(true);
            setImageOrder(order);
        }
    }, [])

    const updateCustomSize = event => setCustomSize(event.target.checked);

    const addImage = () => {
        document.getElementById('creator-portal-image-input').click();
    }

    const updateOrder = (event, index) => {
        var order = imageOrder;
        order[index] = parseInt(event.target.value)-1;
        setImageOrder([]);
        setImageOrder(order);
    }

    const sendUpdateForm = async event => {
        event.preventDefault();

        // check order is valid
        var orderTotal = 0;
        var desiredTotal = 0;
        for(var i = 0; i < images.length; i++){
            if(imageOrder[i] <= images.length-1){
                orderTotal += imageOrder[i]; 
            } else orderTotal += 100;
            desiredTotal += i;
        }

        if(orderTotal === desiredTotal){
            var form = document.getElementById('creator-portal-edit-form');
            var data = new FormData(form);
            
            data.append('productID', productID);
            data.append('price', document.getElementById("edit-money-input").value);
            // send if images are changed or not
            if(product.images != images) data.append('imagesChanged', true);
            else data.append('imagesChanged', false);
            data.append('images', images);
            data.append('imagesCleared', cleared);
            data.append('imageOrder', imageOrder);
            data.append('customSize', customSize);
    
            var res = await updateProduct(data, username, token);
            if(res.success) Flash("Product Updated", "dark");
            else Flash("Product failed to update", "danger");
        } else {
            Flash("Order invalid", "danger");
        }
    }

    return (
        <div id="edit-product">
                <div className="text-center">
                    <span className="fs-2">◆ Edit Product ◆</span>
                </div>
                <hr className="mb-4"/>
                <Form id="creator-portal-edit-form" onSubmit={sendUpdateForm}>
                    <Form.Control multiple name="images" accept="image/jpeg, image/jpg" id="creator-portal-image-input" type="file" className="mb-2 visually-hidden"/>
                    <div id="creator-portal-images" className="mb-3">
                        <Desktop>
                            <Carousel className="carousel custom-upload-creator-carousel mb-2" dragging>
                                {images.length > 0 ?
                                    images.map((image, index) => 
                                    {
                                        var imageSRC = (typeof images[index] === 'string') ? `/images/products/${images[index]}` : URL.createObjectURL(images[index]); 
                                        return(
                                            <img className="creator-portal product-upload-image" src={imageSRC} key={index}/>
                                        )
                                    })
                                        :
                                        <img className="product-upload-image" src="/images/default.jpg"/>
                                    }
                            </Carousel>
                        </Desktop>
                        <Mobile>
                            <Carousel className="carousel mb-2" width={'100%'} height='100%' dragging>
                                {images.length > 0 ?
                                    images.map((image, index) => 
                                    {
                                        var imageSRC = (typeof image === 'string') ? `/images/products/${image}` : URL.createObjectURL(image); 
                                        return(
                                            <img className="creator-portalproduct-upload-image" src={imageSRC} key={index}/>
                                        )
                                    })
                                        :
                                        <img className="product-upload-image" src="/images/default.jpg"/>
                                    }
                            </Carousel>
                        </Mobile>
                        <Button variant="secondary" className="w-100 mb-1 radius-zero" onClick={addImage}>Set Images</Button>
                    </div>
                    {product &&
                        <div>
                            {images &&
                                <div>
                                    <Form.Text>Image Order</Form.Text>
                                    <div id="image-order" className="mb-2">
                                        {imageOrder.length > 0 &&
                                            imageOrder.map((order, index) => {
                                                var imageSRC = (typeof images[index] === 'string') ? `/images/products/${images[index]}` : URL.createObjectURL(images[index]);
                                                return(
                                                    <div className="order-image-parent">
                                                        {images[index] && 
                                                            <img src={imageSRC} className="image-order-picture"/>
                                                        }
                                                        <Form.Control className="image-order-element" key={index} type="number" defaultValue={order+1} onChange={(e) => updateOrder(e, index)}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            }
                            {/* <Form.Text>Image Order</Form.Text>
                            <div id="edit-image-order" className="mb-2">
                                {product && product.imageOrder.map((order, index) => (
                                    <Form.Control onChange={(e) => updateOrder(e, index)} type="number" defaultValue={order+1} className="black-custom-input"/>
                                ))}
                            </div> */}
                            <Form.Text>Name</Form.Text>
                            <Form.Control required name="name" type="text" defaultValue={product.name} className="mb-2 custom-input"/>
                            <Form.Text>Price</Form.Text>
                            <InputGroup>
                                <InputGroup.Text className="custom-input">£</InputGroup.Text>
                                <Form.Control type="number" className="custom-input" placeholder="price" min={0} required defaultValue={product.price} id="edit-money-input"/>
                            </InputGroup>
                            {/* <CurrencyInput required allowNegativeValue={false} defaultValue={product.price} id="edit-money-input" prefix='$' className="custom-input mb-2 w-100" placeholder="Enter Price" decimalsLimit={2}/> */}
                            <Form.Text>Description</Form.Text>
                            <Form.Control required name="description" as="textarea" defaultValue={product.description} placeholder="Enter description..." className="custom-input mb-2"/>
                            <Form.Text>Count</Form.Text>
                            <Form.Control required name="count" min="0" type="number" defaultValue={product.count} className="custom-input mb-2"/>
                            <Form.Text>Sizes (comma seperated)</Form.Text>
                            <Form.Control required name="sizes" placeholder="'Small, Medium, Large', or '1 Size' ..." className="custom-input" defaultValue={product.sizes}/>
                            <Form.Check label="Allow custom sizes" onChange={updateCustomSize} checked={customSize} className="custom-input mb-2"/>
                            <Form.Select required name="type" className="custom-input mb-2" defaultValue={product.type}>
                                <option value="made">Made By</option>
                                <option value="own">Creator's Own</option>
                            </Form.Select>
                            <DateTime
                                initialValue={new Date(product.dateToPost)}
                                closeOnSelect={true}
                                className="mb-2 mt-2 w-100"
                                inputProps={{placeholder: 'Upload Date...',
                                            className: "date-input-upload-form",
                                            readOnly: true,
                                            name: 'dateToPost'
                                }}
                            />
                            <Button variant="success" type="submit" className="w-100">UPDATE</Button>
                        </div>
                    }
                </Form>
        </div>
    )
}

export default EditProduct;