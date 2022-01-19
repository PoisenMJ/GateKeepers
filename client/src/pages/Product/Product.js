import React, { useContext, useEffect, useState } from 'react';
import './Product.css';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../controllers/creators';
import { Button } from 'react-bootstrap';
import Carousel from 'nuka-carousel';
import { useNavigate } from 'react-router';
import { CartContext } from '../../services/CartContext';
import { Flash } from '../../components/FlashMessage/FlashMessage';

const ProductPage = () => {
    let navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [size, setSize] = useState(null);
    const {productURI} = useParams();
    const [purchasable, setPurchasable] = useState(false);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            var res = await getProduct(productURI);
            if(res.success){
                setPurchasable(new Date(res.product.dateToPost) < new Date());
                setProduct(res.product);
            }
            else navigate('/');
        }
        fetchProduct();
    }, [])

    const selectSize = (_size) => {
        setSize(_size);
    }

    const AddToCart = (_uri, _size, _price, _name) => {
        var productJSON = {
            uri: _uri,
            name: _name,
            size: _size,
            price: _price
        };
        addToCart(productJSON);
        Flash("Added to cart", "dark");
    }

    var addToCartDisabled = (purchasable) ? false : true;
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
                        <div id="product-sizing">
                            {product.sizes.map((_size, index) => {
                                var className=(index == product.sizes.length-1)?"product-sizing-item":"product-sizing-item-left";
                                var activeClassName=(size === _size)?" active":"";
                                return (
                                    <span key={_size} onClick={() => selectSize(_size)} className={"product-sizing-item "+className+activeClassName}>{_size}</span>
                                )
                            })}
                        </div>
                        <div style={{display: 'grid', alignContent: 'center', width: '100vw', paddingLeft: '10px', paddingRight: '10px'}}>
                            <span className="fs-3 mb-2 product-price">${product.price} <span className="text-muted fs-5">: {product.count >= 0 ? product.count : 0} {purchasable ? 'LEFT' : 'AVAILABLE'}</span></span>
                            <span className="fs-2 fw-bold">{product.name}</span>
                            <span className="fs-6 fw-light mb-4">{product.description}</span>
                            <Button disabled={addToCartDisabled} onClick={() => AddToCart(product.uri, size, product.price, product.name)} variant={"dark"} className="w-100" style={{alignSelf: 'end'}}>Add To Cart</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default ProductPage;