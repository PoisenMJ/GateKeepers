import React, { useContext, useEffect, useState } from 'react';
import './Product.css';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../controllers/creators';
import { Button, Form } from 'react-bootstrap';
import Carousel from 'nuka-carousel';
import { useNavigate } from 'react-router';
import { CartContext } from '../../services/CartContext';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import { Mobile, Desktop } from '../../components/Query';

const ProductPage = () => {
    let navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [size, setSize] = useState('');
    const { productURI, type } = useParams();
    const [purchasable, setPurchasable] = useState(false);
    const [customSize, setCustomSize] = useState('');
    const { addToCart, products } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            var res = await getProduct(productURI, type);
            if(res.success){
                setPurchasable(new Date(res.product.dateToPost) < new Date() && res.product.count > 0);
                setProduct(res.product);
            }
            else navigate('/');
        }
        fetchProduct();
    }, [])

    const selectSize = (event) => {
        if(customSize) setCustomSize('');
        setSize(event.target.value);
    }
    const updateCustomSize = event => {
        var input = event.target.value.trim();
        setCustomSize(input);
    }

    const AddToCart = (_uri, _size, _price, _name, _creator, _count, _type) => {
        if(_count > 0){
            var productJSON = {
                uri: _uri,
                name: _name,
                size: (customSize) ? customSize : _size,
                price: _price,
                creator: _creator,
                type: _type
            };
            var success = addToCart(productJSON);
            if(success) Flash("Added to cart", "dark");
            else Flash("Can't have multiple creator products in cart", "warning");
        } else Flash("No products left", "dark");
    }

    var addToCartDisabled = (purchasable) ? false : true;
    return (
        <div className="d-flex flex-column flex-sm-column flex-md-row flex-lg-row flex-xl-row flex-xxl-row">
            {product &&
                <>
                    <div class="carousel slide" data-bs-ride="carousel" id="product-images">
                        <div class="carousel-inner" id="product-slides">
                            {product.images.map((image, index) => (
                                <div class={(index===0)?"carousel-item h-100 active":"carousel-item h-100"} key={index}>
                                    <img class="w-100 d-block product-image" src={`/images/products/${image}`} alt="Slide Image"/>
                                </div>
                            ))}
                        </div>
                        <div>
                            <a class="carousel-control-prev" href="#product-images" role="button" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon"></span>
                                <span class="visually-hidden">Previous</span>
                            </a>
                            <a class="carousel-control-next" href="#product-images" role="button" data-bs-slide="next">
                                <span class="carousel-control-next-icon"></span>
                                <span class="visually-hidden">Next</span>
                            </a>
                        </div>
                        <ol class="carousel-indicators">
                            <li data-bs-target="#product-images" data-bs-slide-to="0" class="active"></li>
                            <li data-bs-target="#product-images" data-bs-slide-to="1"></li>
                            <li data-bs-target="#product-images" data-bs-slide-to="2"></li>
                        </ol>
                    </div>
                    <div id="product-info-parent">
                        <div class="d-flex flex-column mb-2">
                            <h1 class="m-auto mb-2" id="product-info-name">{product.name}</h1>
                            <span className="fw-lighter fs-6 mb-1">{product.description}</span>
                            <span class="fs-4 fw-bolder"> £{product.price} : <span className="fs-5">{product.count > 0 ? product.count+" AVAILABLE": "OUT OF STOCK"}</span></span>
                        </div>
                        <div class="d-flex flex-column align-self-end">
                            <select class="custom-black-select my-1 w-100" required="">
                                {product.sizes.map((size, index2) => (
                                    <option key={index2} value={size.trim()} selected="">{size}</option>
                                ))}
                            </select>
                            <button
                                class="btn btn-primary fw-bold w-100"
                                type="button"
                                disabled={addToCartDisabled}
                                onClick={() => AddToCart(product.uri, size, product.price, product.name, product.creator.tag, product.count, product.type)}>
                                    {(addToCartDisabled)?'UNAVAILABLE':'ADD TO CART'}</button>
                        </div>
                    </div>
                </>
            }
        </div>
        // <div id="product">
        //     {product &&
        //         <div id="product-parent">
        //             <Desktop>
        //                 <Carousel
        //                     slideWidth={1}
        //                     slidesToShow={1}
        //                     cellAlign='center'
        //                     dragging
        //                     className='custom-carousel-classses'>
        //                     {product.images.map((image, index) => (
        //                         <div key={index} className="item">
        //                             <img key={index} id="product-image" src={`/images/products/${product.images[product.imageOrder[index]]}`}/> 
        //                         </div>
        //                     ))}
        //                 </Carousel>
        //             </Desktop>
        //             <Mobile>
        //                 <Carousel dragging className='carousel mb-1 custom-carousel-classses'>
        //                     {product.images.map((image, index) => (
        //                         <div key={index} className="item">
        //                             <img key={index} id="product-image" src={`/images/products/${product.images[product.imageOrder[index]]}`}/> 
        //                         </div>
        //                     ))}
        //                 </Carousel>
        //             </Mobile>
        //             <div id="product-info">
        //                 <span className="fs-3 product-price mb-3">£{product.price} <span className="text-muted fs-5">: {product.count >= 0 ? product.count : 0} {purchasable ? 'LEFT' : 'AVAILABLE'}</span></span>
        //                 <span className="fs-2 fw-bold mb-1" id="product-name"> {product.name} </span>
        //                 <span className="fs-6 fw-light" id="product-description">{product.description}</span>
        //                 <Desktop>
        //                     <hr className="breaker"/>
        //                 </Desktop>
        //                 <div id="product-sizing-parent">
        //                     {product.sizes.length > 0 &&
        //                         <div id="product-sizing">
        //                             <select onChange={selectSize} className="black-custom-input-round w-100">
        //                                 {product.sizes.map((_size, index) => {
        //                                     if(index < product.sizes.length)
        //                                         return <option className="text-center" key={index} value={_size.trim()}>{_size.trim()}</option>
        //                                 })}
        //                                 {product.customSize &&
        //                                     <option className="text-center" value="OTHER_SIZE">Other Size</option>
        //                                 }
        //                             </select>
        //                         </div>
        //                     }
        //                     {size === "OTHER_SIZE" || product.sizes.length === 0 &&
        //                         <div id="product-custom-size" className='mb-1'>
        //                             <Form.Control onChange={updateCustomSize} type="text" className="custom-input" placeholder="ENTER SIZE (e.g. 40 EU)"/>
        //                         </div>
        //                     }
        //                 </div>
        //                 <Button disabled={addToCartDisabled}
        //                         id="add-to-cart"
        //                         onClick={() => AddToCart(product.uri, size, product.price, product.name, product.creator.tag, product.count, product.type)}
        //                         variant={"dark"}
        //                         style={{alignSelf: 'end', justifySelf: 'center', marginBottom: '.5rem'}}>{purchasable ? 'Add To Cart' : 'Unavailable'}</Button>
        //             </div>
        //         </div>
        //     }
        // </div>
    );
}

export default ProductPage;