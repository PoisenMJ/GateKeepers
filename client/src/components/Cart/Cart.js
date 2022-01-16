import React, { useContext, useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../../services/CartContext';
import { useNavigate } from 'react-router';
import './Cart.css';

const Cart = ({clicked}) => {
    let navigate = useNavigate();
    const { products } = useContext(CartContext);

    const navigateToShoppingBasket = event => {
        clicked();
        navigate('/shopping-basket');
    }

    return (
        <div className="cart-button fs-3" onClick={navigateToShoppingBasket}>
            {products.length}
            <FaShoppingCart className="cart-icon" color='#fff' size={30}/>
        </div>
    )
}

export default Cart;