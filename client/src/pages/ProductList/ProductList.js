import React, { useState, useEffect } from 'react';
import './ProductList.css';
import { getOwnProducts, getMadeProducts, getCreatorShippingCountries } from '../../controllers/creators';
import { useParams, useNavigate } from 'react-router-dom';

const ProductsPage = ({ type }) => {
    const [products, setProducts] = useState(null);
    const [shippingCountries, setShippingCountries] = useState([]);
    const {creator} = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            var products;
            if(type === "own"){
                products = await getOwnProducts(creator);
                if(products.success === false) navigate("/");
            }
            else if(type === "made"){
                products = await getMadeProducts(creator);
                if(products.success === false) navigate("/");
            }
            setProducts(products.products);

            var res = await getCreatorShippingCountries(creator);
            if(res.success) setShippingCountries(Object.keys(res.shippingDetails));
        }
        fetchData();
    }, [type, creator])

    const viewProduct = (path) => {
        navigate('../'+encodeURIComponent(path)+'/'+type);
    }

    return (
        <div id="products-page">
            <div className="w-100 text-center mb-3">
                {type === "own" ?
                    <div>
                        <p className="text-uppercase text-muted fw-bold" style={{marginBottom: '6px'}}>
                            Clothes from <span className="text-danger">@{creator}'s</span> wardrobe.</p>
                        {shippingCountries.length > 0 &&
                            <div style={{display: 'inline'}}>
                                <span style={{fontSize: '.85rem'}} className="text-secondary">SHIPS TO:    </span>
                                <select className="black-custom-input" style={{border: 'none', padding: '2px 4px 2px 4px'}}>
                                    {shippingCountries.map((country, index) => (
                                        <option key={index}>{country}</option>
                                    ))}
                                </select>
                            </div>
                        }
                    </div>
                    :
                    <span className="text-uppercase">
                        Made by @{creator}
                        <p className="text-lowercase text-muted">Clothes hand made by @{creator}.</p>
                    </span>
                }
            </div>
            <hr className="mx-5"/>
            <div id="products">
                {products && products.map((product, index) => {
                    var date = new Date(product.dateToPost);
                    var available = (new Date() < date);
                    var outOfStock = (product.count <= 0);
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

                    return (
                        <div key={product.name} className={"product mb-3"+c} onClick={() => viewProduct(product.uri)}>
                            <div className="product-image-parent">
                                <img src={`/images/products/${product.images[product.imageOrder[0]]}`} className={"product-image"+imageC}/>
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
                                <span className="fs-4 fw-light">◆ {product.name} ◆</span>
                                <span className="fs-5">£{product.price}</span>
                            </div>
                        </div>
                    )
                })}
                {products && products.length === 0 &&
                    <span className="text-center fs-1 no-prods-available">No Products Available</span>
                }
            </div>
        </div>
    )
};

export default ProductsPage;