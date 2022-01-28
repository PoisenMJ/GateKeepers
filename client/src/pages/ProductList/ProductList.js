import React, { useState, useEffect, useContext } from 'react';
import './ProductList.css';
import { getOwnProducts, getMadeProducts } from '../../controllers/creators';
import { useParams, useNavigate } from 'react-router-dom';
import { LocaleContext, ConvertPrice } from '../../services/LocaleContext';

const ProductsPage = ({ type }) => {
    const [products, setProducts] = useState(null);
    const {creator} = useParams();
    let navigate = useNavigate();
    const { currency, locale } = useContext(LocaleContext);

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
                    var date = new Date(product.dateToPost);
                    var available = (new Date() < date);
                    var outOfStock = (product.count === 0);
                    // if not ready yet change class
                    var c = (available) ? ' unavailable-product' : (outOfStock) ? ' out-of-stock-product' : '';
                    var imageC = (available || outOfStock) ? ' unavailable-product-image' : '';
                    
                    // time format
                    var hours = date.getHours();
                    var minutes = date.getMinutes();
                    minutes = ('0'+minutes).slice(-2);
                    var ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // the hour '0' should be '12'
                    var strTime = hours + ':' + minutes + ' ' + ampm;

                    console.log(date.getMinutes());
                    return (
                        <div key={product.name} className={"product mb-4"+c} onClick={() => viewProduct(product.uri)}>
                            <div className="product-image-parent">
                                <img src={`/images/products/${product.images[0]}`} className={"product-image"+imageC}/>
                                {available &&
                                        <span className="product-image-text">
                                            RELEASING SOON
                                            <br/>
                                            {date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()}
                                            <br/>
                                            <span style={{fontSize: '.9rem', color: 'rgb(200,200,200)'}}>{strTime}</span>
                                        </span>
                                }
                                {outOfStock &&
                                    <span className='product-image-text text-white'>
                                        OUT OF STOCK
                                    </span>
                                }
                            </div>
                            <div className="product-info">
                                <span className="fs-4 fw-light">{product.name}</span>
                                <span className="fs-5">{currency}{ConvertPrice(locale, product.price)}</span>
                            </div>
                        </div>
                    )
                })}
                {products && products.length == 0 &&
                    <span className="text-center fs-1 no-prods-available">No Products Available</span>
                }
            </div>
        </div>
    )
};

export default ProductsPage;