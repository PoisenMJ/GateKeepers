import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getProduct, updateProduct } from '../../../controllers/gatekeepers';
import { AuthContext } from '../../../services/AuthContext.js';
import { Form, Button } from 'react-bootstrap';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import CurrencyInput from 'react-currency-input-field';
import Carousel from 'nuka-carousel';
import DateTime from 'react-datetime';
import './EditProduct.css';

const EditProduct = () => {
    var {productID} = useParams();
    const [product, setProduct] = useState(null);
    const { username, token } = useContext(AuthContext);
    const [images, setImages] = useState(null);
    const [cleared, setCleared] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            var data = await getProduct(productID, username, token);
            setProduct(data.product);
            setImages(data.product.images);
        }
        fetch();
    }, [])

    const addImage = () => {
        var imageInput = document.getElementById('creator-portal-image-input');
        imageInput.click();
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
    }
    const clearImages = () => {
        setImages(null);
        setCleared(true);
    }

    const sendUpdateForm = async event => {
        event.preventDefault();
        // get rid of $ prefix
        var m = document.getElementById("edit-money-input");

        var form = document.getElementById('creator-portal-edit-form');
        var data = new FormData(form);
        
        data.append('productID', productID);
        data.append('price', m.value.substring(1, m.value.length));
        // send if images are changed or not
        if(product.images != images) data.append('imagesChanged', true);
        else data.append('imagesChanged', false);
        data.append('images', images);
        data.append('imagesCleared', cleared);

        var res = await updateProduct(data, username, token);
        if(res.success) Flash("Product Updated", "dark");
        else Flash("Product failed to update", "danger");
    }

    return (
        <div id="edit-product">
                <Form id="creator-portal-edit-form" onSubmit={sendUpdateForm}>
                    <Form.Control multiple name="images" id="creator-portal-image-input" type="file" className="mb-2 visually-hidden"/>
                    <div id="creator-portal-images" className="mb-3">
                        <Carousel className="carousel mb-2" width={'100%'} height='100%' dragging>
                            {images ?
                                images.map((image, index) => 
                                {
                                    var imageSRC = (typeof images[index] === 'string') ? `/images/products/${images[index]}` : URL.createObjectURL(images[index]); 
                                    return(
                                        <img className="creator-portalproduct-upload-image" src={imageSRC} key={index}/>
                                    )
                                })
                                    :
                                    <img className="product-upload-image" src="/images/default.jpg"/>
                                }
                        </Carousel>
                        <Button variant="secondary" className="w-100 mb-1" onClick={addImage}>Change Images</Button>
                        <Button variant="outline-dark" className="w-100" onClick={clearImages}>Clear Images</Button>
                    </div>
                    {product &&
                        <div>
                            <Form.Control required name="name" type="text" defaultValue={product.name} className="mb-2 custom-input"/>
                            <CurrencyInput required allowNegativeValue={false} defaultValue={product.price} id="edit-money-input" prefix='$' className="custom-input mb-2 w-100" placeholder="Enter Price" decimalsLimit={2}/>
                            <Form.Control required name="description" as="textarea" defaultValue={product.description} placeholder="Enter description..." className="custom-input mb-2"/>
                            <Form.Control required name="count" min="0" type="number" defaultValue={product.count} className="custom-input mb-2"/>
                            <Form.Control required name="sizes" placeholder="'Small, Medium, Large', or '1 Size' ..." className="custom-input mb-2" defaultValue={product.sizes}/>
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