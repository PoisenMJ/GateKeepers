import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getCreatorPortalProduct } from '../../../controllers/creators.js';
import { AuthContext } from '../../../services/AuthContext.js';
import { Form, Button } from 'react-bootstrap';
import CurrencyInput from 'react-currency-input-field';
import Carousel from 'nuka-carousel';
import './EditProduct.js';

const EditProduct = () => {
    var {productID} = useParams();
    const [product, setProduct] = useState(null);
    const { username } = useContext(AuthContext);

    const [images, setImages] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            var data = await getCreatorPortalProduct(productID, username);
            setProduct(data.product);
        }
        fetch();
    }, [])

    return (
        <div id="edit-product">
            {product &&
                <Form id="upload-form">
                    <Form.Control name="name" type="text" placeholder="Product Name" className="mb-2 custom-input"/>
                    <Form.Control multiple name="images" id="image-input" type="file" className="mb-2 visually-hidden"/>
                    <div id="product-images" className="mb-4">
                        <Carousel className="carousel mb-1" width={'100%'} height='100%' dragging>
                            {product.images ?
                                product.images.map((image, index) => (
                                    <img className="product-upload-image" src={URL.createObjectURL(image)} key={index}/>
                                ))
                                :
                                <img className="product-upload-image" src="/images/default.jpg"/>
                            }
                        </Carousel>
                        <Button variant="outline-secondary" className="w-100">Add Image</Button>
                    </div>
                    <CurrencyInput name="price" allowNegativeValue={false} id="money-input" prefix='$' className="custom-input mb-2 w-100" placeholder="Enter Price" decimalsLimit={2}/>
                    <Form.Control name="description" as="textarea" placeholder="Enter description..." className="custom-input mb-2"/>
                    <Form.Select name="type" className="custom-input mb-2">
                        <option value="made">Own Product</option>
                        <option value="own">Re-Sell</option>
                    </Form.Select>
                    <Button variant="secondary" type="submit" className="w-100">ADD</Button>
                </Form>
            }
        </div>
    )
}

export default EditProduct;