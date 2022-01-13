import React, { useEffect, useState } from 'react';
import './Product.css';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../controllers/creators';
import { Button } from 'react-bootstrap';
import Carousel from 'nuka-carousel';
import { useNavigate } from 'react-router';

const ProductPage = () => {
    let navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const {productURI} = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            var res = await getProduct(productURI);
            if(res.success) setProduct(res.product);
            else navigate('/');
        }
        fetchProduct();
    }, [])

    return (
        <div id="product">
            {product &&
                <div id="product-parent">
                    <Carousel
                        dragging
                        className='carousel mb-3'
                    >
                        {product.images.map((image, index) => (
                            <div key={index} className="item">
                                <img key={index} id="product-image" src={`/images/products/${image}`}/> 
                            </div>
                        ))}
                    </Carousel>
                    <div id="product-info">
                        <span className="fs-3 mb-2 product-price">${product.price}</span>
                        <span className="fs-2 fw-bold">{product.name}</span>
                        <span className="fs-6 fw-light mb-4">{product.description}</span>
                        <Button variant={"secondary"} className="mx-2">Add To Cart</Button>
                    </div>
                </div>
            }
        </div>
    );
}

export default ProductPage;