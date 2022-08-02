import React, { useContext, useEffect, useState } from 'react';
import './Product.css';
import { useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { getProduct } from '../../controllers/gatekeepers';
import { CartContext } from '../../services/CartContext';
import { Flash } from '../../components/FlashMessage/FlashMessage';

function ProductPage() {
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [size, setSize] = useState('');
    const { productURI, type } = useParams();
    const [purchasable, setPurchasable] = useState(false);
    const [customSize, setCustomSize] = useState('');
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await getProduct(productURI, type);
            if(res.success){
                setPurchasable(new Date(res.product.dateToPost) < new Date() && res.product.count > 0);
                setProduct(res.product);
                setSize(res.product.sizes.length > 0 ? res.product.sizes[0] : "OTHER_SIZE");
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
        const input = event.target.value.trim();
        setCustomSize(input);
    }

    const AddToCart = (_uri, _size, _price, _name, _creator, _count, _type, _image) => {
        if(_count > 0){
            const productJSON = {
                uri: _uri,
                name: _name,
                size: (customSize) || _size,
                price: _price,
                creator: _creator,
                type: _type,
                image: _image
            };
            const success = addToCart(productJSON);
            if(success) Flash("Added to cart", "dark");
            else Flash("Can't have multiple creator products in cart", "warning");
        } else Flash("No products left", "dark");
    }

    const addToCartDisabled = !(purchasable);
    return (
        <div className="d-flex flex-column flex-sm-column flex-md-row flex-lg-row flex-xl-row flex-xxl-row">
            {product &&
                <>
                    <div className="carousel slide" data-bs-ride="carousel" id="product-images">
                        <div className="carousel-inner" id="product-slides">
                            {product.images.map((image, index) => (
                                <div className={(index===0)?"carousel-item h-100 active":"carousel-item h-100"}>
                                    <img className="w-100 d-block product-image" src={`/images/products/${image}`} alt="slide"/>
                                </div>
                            ))}
                        </div>
                        <div>
                            <a className="carousel-control-prev" href="#product-images" role="button" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" />
                                <span className="visually-hidden">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#product-images" role="button" data-bs-slide="next">
                                <span className="carousel-control-next-icon" />
                                <span className="visually-hidden">Next</span>
                            </a>
                        </div>
                        <ol className="carousel-indicators">
                            <li data-bs-target="#product-images" data-bs-slide-to="0" className="active" />
                            <li data-bs-target="#product-images" data-bs-slide-to="1" />
                            <li data-bs-target="#product-images" data-bs-slide-to="2" />
                        </ol>
                    </div>
                    <div id="product-info-parent">
                        <div className="d-flex flex-column mb-2">
                            <h1 className="m-auto mb-2" id="product-info-name">{product.name}</h1>
                            <span className="fs-6 mb-1">{product.description}</span>
                            <span className="fs-4 fw-bolder"> £{product.price} : <span className="fs-5">{product.count > 0 ? `${product.count} AVAILABLE`: "OUT OF STOCK"}</span></span>
                        </div>
                        <div className="d-flex flex-column align-self-end mx-auto product-size-parent">
                            <select className="custom-black-select my-1 w-100 fw-bold" required="" onChange={selectSize}>
                                {product.sizes.map((productSize) => (
                                    <option value={productSize.trim()} selected="">{productSize}</option>
                                ))}
                                {product.customSize &&
                                    <option className="text-center" value="OTHER_SIZE">Other Size</option>
                                }
                            </select>
                            {size === "OTHER_SIZE" || product.sizes.length === 0 &&
                                <div id="product-custom-size" className='mb-1'>
                                    <Form.Control onChange={updateCustomSize} type="text" className="custom-input" placeholder="ENTER SIZE (e.g. 40 EU)"/>
                                </div>
                            }
                            <button
                                className="btn btn-secondary fw-bold w-100"
                                type="button"
                                disabled={addToCartDisabled}
                                onClick={() => AddToCart(product.uri, size, product.price, product.name, product.creator.tag, product.count, product.type, product.images[product.imageOrder[0]])}>
                                    {(addToCartDisabled)?'UNAVAILABLE':'ADD TO CART'}</button>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

export default ProductPage;