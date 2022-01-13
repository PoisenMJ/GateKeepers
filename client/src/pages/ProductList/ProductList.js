import React, { useState, useEffect } from 'react';
import './ProductList.css';
import { getOwnProducts, getMadeProducts } from '../../controllers/creators';
import { useParams, useNavigate } from 'react-router-dom';

const ProductsPage = ({ type }) => {
    const [products, setProducts] = useState(null);
    const {creator} = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            var products;
            if(type == "own") products = await getOwnProducts(creator);
            else if(type == "made") products = await getMadeProducts(creator);
            setProducts(products);
        }
        fetchData();
    }, [type, creator])

    const viewProduct = (path) => {
        navigate('../'+encodeURIComponent(path));
    }

    return (
        <div id="products-page">
            <div className="w-100 text-center mb-3">
                {type == "own" ?
                    <span className="text-muted text-uppercase">Worn by @{creator}</span>
                    :
                    <span className="text-muted text-uppercase">Made by @{creator}</span>
                }
            </div>
            <hr className="mx-5"/>
            <div id="products">
                {products && products.map((product, index) => {
                    return (
                        <div key={product.name} className="product mb-4" onClick={() => viewProduct(product.uri)}>
                            <img src={`/images/products/${product.images[0]}`} className="product-image"/>
                            <div className="product-info">
                                <span className="fs-4 text-muted fw-light">{product.name}</span>
                                <span className="fs-5">${product.price}</span>
                            </div>
                        </div>
                    )
                })}
                {products && products.length == 0 &&
                    <span className="text-center fs-1">No Products Available</span>
                }
            </div>
        </div>
    )
};

export default ProductsPage;