import React, { useState, useEffect } from 'react';
import './ProductList.scss';
import { getOwnProducts, getMadeProducts, getCreatorShippingCountries, getCreatorAccentColor } from '../../controllers/creators';
import { useParams, useNavigate } from 'react-router-dom';

const ProductsPage = ({ type }) => {
    const [products, setProducts] = useState(null);
    const [shippingCountries, setShippingCountries] = useState([]);
    const [accentColor, setAccentColor] = useState('#000000');
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
            var res = await getCreatorAccentColor(creator);
            if(res.success) setAccentColor(res.accentColor);
        }
        fetchData();
    }, [type, creator])

    const viewProduct = (path) => {
        navigate('../'+encodeURIComponent(path)+'/'+type);
    }

    return (
        <div id="products-page">
            <div className="w-100 text-center mb-3">
                    <div className='mb-2'>
                        {type === "own" ?
                            <p className="text-muted fw-bold fs-5" style={{marginBottom: '6px', fontVariant: 'small-caps'}}>
                                Clothes from <span style={{color: accentColor}}>@{creator}'s</span> wardrobe.</p>
                            :<p className="text-muted fw-bold fs-5" style={{marginBottom: '6px', fontVariant: 'small-caps'}}>
                                Clothes hand made by <span style={{color: accentColor}}>@{creator}</span>.</p>
                        }
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
                    <p className="custom-divider">GK</p>
            </div>
            {/* <hr className="mx-5"/> */}
            <div id="products">
                {products && products.map((product, index) => {
                    var date = new Date(product.dateToPost);
                    var available = (new Date() < date);
                    var outOfStock = (product.count <= 0);
                    // if not ready yet change class
                    var c = (outOfStock) ? ' out-of-stock-product' : (available) ? ' unavailable-product' : '';
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
                        <div key={product.name}
                            className={"product mb-3"+c} 
                            onClick={() => viewProduct(product.uri)}
                            style={{boxShadow: `1px 1px ${accentColor}, 2px 2px ${accentColor}, 3px 3px ${accentColor}, 4px 4px ${accentColor}, 5px 5px ${accentColor}, 6px 6px ${accentColor}, 7px 7px ${accentColor}, 8px 8px ${accentColor}`}}>
                            <div className="product-image-parent">
                                <img src={`/images/products/${product.images[product.imageOrder[0]]}`} className={"product-image"+imageC}/>
                                {available && !outOfStock &&
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