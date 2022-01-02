import { React, useState, useEffect } from 'react';
import './ProductsPage.css';
import { getWornByProducts, getMadeProducts } from '../../controllers/creators';
import { useParams } from 'react-router-dom';

const ProductsPage = ({ type }) => {
    const [products, setProducts] = useState(null);
    const {creator} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            var products;
            if(type == "own") products = await getWornByProducts(creator);
            else if(type == "made") products = await getMadeProducts(creator);
            setProducts(products);
        }
        fetchData();
    })

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
                        <div key={product._id} className="product mb-4">
                            <img src={`/images/products/${product.images[0]}`} className="product-image"/>
                            <div className="product-info">
                                <span className="fs-4 text-muted fw-light">{product.name}</span>
                                <span className="fs-5">${product.price}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default ProductsPage;