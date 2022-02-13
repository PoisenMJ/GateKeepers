import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../services/CartContext';
import { Button, CloseButton } from 'react-bootstrap';
import { getProduct } from '../../controllers/creators';
import './ShoppingBasket.css';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../services/AuthContext';

const ShoppingBasket = () => {
    let navigate = useNavigate();
    
    const { products, total, removeFromCart, clearCart } = useContext(CartContext);
    const { username } = useContext(AuthContext);
    const [productsData, setProductsData] = useState(null);

    // localStorage.removeItem('cart');
    // localStorage.removeItem('cartTotal');
    // console.log(total);
    
    useEffect(() => {
        console.log(products);
        if(products.length > 0){
            var productsArray = []
            const getData = async () => {
                for(var i = 0; i < products.length; i++){
                    var res = await getProduct(products[i].uri, products[i].type);
                    productsArray.push({
                        "name": res.product.name,
                        "price": res.product.price,
                        "size": products[i].size,
                        "creator": res.product.creator.tag,
                        "uri": res.product.uri,
                        "image": res.product.images[res.product.imageOrder[0]]
                    });
                }
                setProductsData(productsArray);
            }
            getData();
        }
    }, []);

    const removeFromBasket = (uri, price, index) => {
        removeFromCart({uri,price});
        productsData.splice(index, 1);
        if(productsData.length > 0) setProductsData(productsData);
        else setProductsData(null);
    }
    
    const goToPaymentDetails = async event => {
        navigate("/payment-details");
    }

    return (
        <div id="shopping-basket" className='text-center'>
            <span className="fs-1">▣ BASKET ▣</span>
            <hr className="mx-5"/>
            <div id="shopping-basket-products" className="mb-3">
                {productsData ?
                    productsData.map((product, index) => {
                        return (
                            <div key={index}>
                                <div className="shopping-basket-product">
                                    <img className="shopping-basket-product-image" src={`/images/products/${product.image}`} alt="product-image"/>
                                    <span className="shopping-basket-product-name fs-4">{product.name}</span>
                                    <div className="shopping-basket-product-info">
                                        <span className="shopping-basket-product-creator">{product.creator}</span>
                                        <span className="shopping-basket-product-size">{product.size}</span>
                                    </div>
                                    <span className="shopping-basket-product-price">£{product.price}</span>
                                    <div className="shopping-basket-product-remove">
                                        <CloseButton onClick={() => removeFromBasket(product.uri, product.price, index)} variant="white"/>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                :
                    <div style={{height: '40vh', display: 'grid', placeItems: 'center'}}>
                        <div>
                            <span className="fs-3">CART IS EMPTY</span>
                            <br/>
                            <span className="go-to-products" onClick={() => navigate("/maksie_aki/own")}>Go to products</span>
                        </div>
                    </div>
                }
                {productsData &&
                    <div id="shopping-basket-totals">
                        <span className='fs-2 shopping-basket-total-work'>TOTAL:   £{total}</span>
                        <Button className="shopping-basket-proceed" onClick={goToPaymentDetails} variant="dark">Proceed<FaArrowRight style={{marginLeft: '6px', marginBottom: '3px'}}/></Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default ShoppingBasket;