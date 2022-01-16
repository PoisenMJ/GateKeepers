import React, { useState, useEffect, useContext } from 'react';

const CartContext = React.createContext({
    products: null,
    total: null,
    setProducts: (data) => { },
    addToCart: (data) => { },
    removeFromCart: (data) => { },
    clearCart: (data) => { }
})

const CartProvider = ({ children }) => {
    const localProducts = JSON.parse(localStorage.getItem('cart')) || [];
    const localTotal = JSON.parse(localStorage.getItem('cartTotal')) || 0;
    const [products, setProducts] = useState(localProducts);
    const [total, setTotal] = useState(localTotal);

    const add = (product) => {
        products.push(product);
        setProducts(products);
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
        setProducts(products);
        setTotal(total-product.price);

        localStorage.setItem('cart', JSON.stringify(products));
        localStorage.setItem('cartTotal', total-product.price);
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
        setProducts: setProducts,
        addToCart: add,
        removeFromCart: remove,
        clearCart: clear
    }}>
        {children}
    </CartContext.Provider>
}

export { CartContext, CartProvider };