import React, { useState, useEffect } from 'react';
import './ProductList.scss';
import { getOwnProducts, getMadeProducts, getCreatorShippingCountries, getCreatorAccentColor } from '../../controllers/creators';
import { useParams, useNavigate } from 'react-router-dom';
import { FaAngleDoubleRight, FaChevronDown } from 'react-icons/fa';

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
        <>
            <div className="d-flex ps-2 pt-3 pe-2" style={{ alignItems: 'center', position: 'relative', zIndex: '10' }}>
                <div style={{ position: 'relative', left: '50%', transform: 'translateX(-50%)', width: 'fit-content' }}>
                    {type === "made" ?
                        <p className="fw-bold text-muted text-center my-0">Clothes made by&nbsp;<span className="text-dark"><strong>@MAKSIE_AKI</strong></span>.</p>:
                        <p className="fw-bold text-muted text-center my-0">Clothes from&nbsp;<span className="text-dark"><strong>@MAKSIE_AKI'S</strong></span> own wardrobe.</p>
                    }
                    <div className="d-flex flex-row justify-content-center align-items-center my-1"><span className="fw-bold text-muted t-9">SHIPS TO:</span>
                        <div className="dropdown mx-2">
                            <button className="btn btn-dark btn-sm dropdown-toggle fw-bold black-dropdown" aria-expanded="false" data-bs-toggle="dropdown" type="button">UNITED KINGDOM&nbsp;</button>
                            <div className="dropdown-menu">
                                {shippingCountries && shippingCountries.map((country, index) => (
                                    <a className="dropdown-item pointer" key={index}>{country}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <span onClick={() => navigate(`/${creator}/library`)}
                    className="fs-3 outfit-link pe-3 d-flex flex-row"
                    style={{position: 'absolute', left: '100%', transform: 'translateX(-100%)'}}>
                        OUTFITS<FaAngleDoubleRight style={{marginTop: '7px'}}/></span>
            </div>
            <p className="custom-divider my-2">GK</p>
            <div className="row g-0 products">
                {products && products.map((product, index) => {
                    var date = new Date(product.dateToPost);
                    var available = !(new Date() < date);
                    var outOfStock = (product.count <= 0);

                    // if not ready yet change class
                    var productClass = (outOfStock) ? ' out-of-stock-product' : (!available) ? ' unavailable-product' : '';
                    var imageClass = (!available || outOfStock) ? ' unavailable-product-image' : '';                 

                    // time format for (releasing soon)
                    var strTime;
                    if(!available && !outOfStock){
                        var hours = date.getHours() % 12;
                        hours = hours ? hours : 12; // the hour '0' should be '12'
                        var minutes = ('0'+date.getMinutes()).slice(-2);
                        var ampm = hours >= 12 ? 'PM' : 'AM';
                        strTime = hours + ':' + minutes + ' ' + ampm;
                    }

                    return (
                        <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3"
                            key={index}
                            onClick={() => viewProduct(product.uri)}>
                            <div className={"product-list"+productClass}>
                                <img className={"product-image"+imageClass} src={`/images/products/${product.images[product.imageOrder[0]]}`}/>
                                <div className="d-flex flex-column justify-content-center align-items-center">
                                    <span className="fw-normal fs-4">◎ {product.name} ◎</span>
                                    <span className="fw-bolder fs-5"><strong>£{product.price}</strong></span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
};

export default ProductsPage;