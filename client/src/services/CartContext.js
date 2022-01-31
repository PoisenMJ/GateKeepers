import React, { useState, useEffect, useContext } from 'react';

const CartContext = React.createContext({
    products: null,
    total: null,
    shippingAddress: null,
    setShippingAddress: (data) => { },
    setProducts: (data) => { },
    addToCart: (data) => { },
    removeFromCart: (data) => { },
    clearCart: (data) => { },
})

const CartProvider = ({ children }) => {
    const localProducts = JSON.parse(localStorage.getItem('cart')) || [];
    const localTotal = JSON.parse(localStorage.getItem('cartTotal')) || 0;
    const localShippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || null;
    const [products, setProducts] = useState(localProducts);
    const [total, setTotal] = useState(localTotal);
    const [shippingAddress, setShippingAddress] = useState(localShippingAddress);

    const add = (product) => {
        products.push(product);
        setProducts(products);
        console.log(products);
        setTotal(total+product.price);

        localStorage.setItem('cart', JSON.stringify(products));
        localStorage.setItem('cartTotal', total+product.price);
    }

    const remove = (product) => {
        for(var i = 0; i < products.length; i++){
            if(products[i].uri == product.uri){
                products.splice(i, 1);
                break;
            }
        }
        setProducts([]);
        setProducts(products);
        setTotal(total-product.price);

        localStorage.setItem('cart', JSON.stringify(products));
        localStorage.setItem('cartTotal', total-product.price);
    }

    const setShipping = (address) => {
        setShippingAddress(address);
        localStorage.setItem('shippingAddress', JSON.stringify(address));
    }

    const clear = () => {
        setProducts([]);
        setTotal(0);
        localStorage.removeItem('cart');
        localStorage.removeItem('cartTotal');
    }

    return <CartContext.Provider value={{
        products: products,
        total: total,
        shippingAddress: shippingAddress,
        setShippingAddress: setShipping,
        setProducts: setProducts,
        addToCart: add,
        removeFromCart: remove,
        clearCart: clear,
    }}>
        {children}
    </CartContext.Provider>
}

export { CartContext, CartProvider };