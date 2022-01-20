import React, { useContext, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { CartContext } from '../../services/CartContext';
import { LocaleContext, GetShippingPrice } from '../../services/LocaleContext';
import { getProduct } from '../../controllers/creators';
import { checkProduct, getCheckoutUrl } from '../../controllers/payment';
import { FaArrowRight } from 'react-icons/fa';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import "./PaymentDetails.css";
import { AuthContext } from '../../services/AuthContext';
import { useNavigate } from 'react-router';

const PaymentDetails = () => {
    let navigate = useNavigate();
    const [shippingPrice, setShippingPrice] = useState(0);
    
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [zipcode, setZipcode] = useState(null);
    const [streetAddress, setStreetAddress] = useState(null);

    const [productsData, setProductsData] = useState(null);
    const { products, total, setShippingAddress } = useContext(CartContext);
    const { currency } = useContext(LocaleContext);
    const { username, token } = useContext(AuthContext);

    const handleInputChange = event => {
        switch(event.target.name){
            case "state":
                setState(event.target.value);
                break;
            case "zipcode":
                setZipcode(event.target.value);
                break;
            case "streetAddress":
                setStreetAddress(event.target.value);
                break;
        }
    }

    useEffect(() => {
        if(products.length > 0){
            var productsArray = []
            const getData = async () => {
                for(var i = 0; i < products.length; i++){
                    var res = await getProduct(products[i].uri);
                    productsArray.push({
                        "name": res.product.name,
                        "price": res.product.price,
                        "size": products[i].size,
                        "creator": res.product.creator.tag,
                        "uri": res.product.uri,
                    });
                }
                setProductsData(productsArray);
            }
            getData();
        } else {
            navigate('/');
        }
        setShippingPrice(GetShippingPrice('austria'));
    }, []);

    const goToStripeCheckout = async event => {
        setShippingAddress({
            country: country,
            state: state,
            zipcode: zipcode,
            streetAddress: streetAddress
        })

        var data = [];
        for(var i = 0; i < productsData.length; i++){
            data.push({
                size: productsData[i].size,
                creator: productsData[i].creator,
                price: productsData[i].price,
                name: productsData[i].name
            })
        }
        var res = await checkProduct(productsData.map((d, i) =>  {return {uri:d.uri, name:d.name}} ));
        if(res.outOfStock) Flash(`${res.name} is out of stock.`);
        else {
            var checkoutUrl = await getCheckoutUrl(data, shippingPrice, username);
            window.location.href = checkoutUrl;
        }
    }

    const onCountryChange = event => {
        setCountry(event.target.value);
        setShippingPrice(GetShippingPrice(event.target.value));
    }

    return (
        <div id="payment-details">
            <div id="payment-details-info" className='text-center'>
                <span className="fs-1">✦ DETAILS ✦</span>
                <Form className="mt-2">
                    <Form.Group className='text-start'>
                        <Form.Text>Email</Form.Text>
                        <Form.Control required name="email" className="mb-2 custom-input" type="text" placeholder="user@provider.com"/>
                    </Form.Group>
                    <Form.Group className='text-start'>
                        <Form.Text>Country</Form.Text>
                        <Form.Select required className="custom-input mb-2" onChange={onCountryChange}>
                            <option value="austria">Austria</option>
                            <option value="canada">Canada</option>
                            <option value="france">France</option>
                            <option value="germany">Germany</option>
                            <option value="hong-kong">Hong Kong</option>
                            <option value="italy">Italy</option>
                            <option value="netherlands">Netherlands</option>
                            <option value="singapore">Singapore</option>
                            <option value="south-korea">South Korea</option>
                            <option value="united-kingdom">United Kingdom</option>
                            <option value="united-states">United States</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='text-start'>
                        <Form.Text>Address</Form.Text>
                        <Form.Control required onChange={handleInputChange} name="state" type="text" name="state" placeholder="STATE" className="mb-2 custom-input"/>
                    </Form.Group>
                    <Form.Control required onChange={handleInputChange} name="zipcode" type="text" name="zipcode" placeholder="Zipcode or NA" className="mb-2 custom-input"/>
                    <Form.Control required onChange={handleInputChange} name="streetAddress" type="text" placeholder="Street name and apartment number" className="custom-input mb-2"/>
                </Form>
            </div>
            <div id="payment-details-total">
                <div>
                    <span className="fs-1">TOTAL : {currency}{total+shippingPrice}</span>
                    <br/>
                    <span className="text-muted" id="payment-details-subtotals">Products : {currency}{total}</span>
                    <br/>
                    <span className="text-muted" id="payment-details-subtotals">Shipping : {currency}{shippingPrice}</span>
                </div>
                <Button onClick={goToStripeCheckout} variant="dark">BUY<FaArrowRight style={{marginBottom: '3px', marginLeft: '5px'}}/></Button>
            </div>
        </div>
    )
}

export default PaymentDetails;