import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../../services/CartContext';
import { getProduct, getCreatorShippingCountries } from '../../controllers/creators';
import { checkProduct, getCheckoutUrl } from '../../controllers/payment';
import { FaArrowRight } from 'react-icons/fa';
import { Flash } from '../../components/FlashMessage/FlashMessage';
import { AuthContext } from '../../services/AuthContext';
import { useNavigate } from 'react-router';
import "./PaymentDetails.css";
import usePlacesAutocomplete, {
    getGeocode
} from "use-places-autocomplete";

const PaymentDetails = () => {
    let navigate = useNavigate();
    const [shippingPrice, setShippingPrice] = useState(0);
    
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [zipcode, setZipcode] = useState(null);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [availableShippingCountries, setAvailableShippingCountries] = useState({});

    const [productsData, setProductsData] = useState(null);
    const { products, total, setShippingAddress } = useContext(CartContext);
    const { username, loggedIn } = useContext(AuthContext);

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
          /* Define search scope here */
        },
        debounce: 300,
    });

    const handleSelect = ({description}) => () => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        clearSuggestions();

        // Get latitude and longitude via utility functions
        getGeocode({address: description}).then((results) => {
            var country = results[0].address_components.filter((e, i) => e.types.includes('country'))[0].long_name;
            var cityOrState = results[0].address_components.filter((e, i) => e.types.includes('postal_town') || e.types.includes('administrative_area_level_1'))[0].long_name;
            var address = results[0].address_components[0].long_name + " " + results[0].address_components[1].long_name;
            var zipcode = results[0].address_components.filter((e, i) => e.types.includes('postal_code'))[0].long_name;

            if(Object.keys(availableShippingCountries).includes(country)){
                setValue(address, false);
                setZipcode(zipcode);
                setCountry(country);
                setState(cityOrState);
            } else Flash("Creator doesn't ship to that country", "dark");
        })
    };


    const renderSuggestions = () => data.map((suggestion) => {
        const {
            place_id,
            structured_formatting: {
                main_text,
                secondary_text
            }
        } = suggestion;
        return (
            <li key={place_id} className="list-group-item auto-fill-item"
                onClick={handleSelect(suggestion)}>
                <span>{main_text} <span className="text-muted">({secondary_text})</span></span>
            </li>
        );
    });

    const handleAddressChange = (e) => {
        setValue(e.target.value);
    }

    const handleInputChange = event => {
        switch(event.target.name){
            case "state":
                setState(event.target.value);
                break;
            case "zipcode":
                setZipcode(event.target.value);
                break;
            // case "streetAddress":
            //     setStreetAddress(event.target.value);
            //     break;
            case "email":
                setEmail(event.target.value);
                break;
            case "firstname":
                setFirstName(event.target.value);
                break;
            case "lastname":
                setLastName(event.target.value);
                break;
        }
    }

    useEffect(() => {
        if(products.length > 0){
            var productsArray = []
            const getData = async () => {
                for(var i = 0; i < products.length; i++){
                    var res = await getProduct(products[i].uri, products[i].type);
                    productsArray.push({
                        "name": res.product.name,
                        "price": res.product.price,
                        "size": products[i].size,
                        "creator": res.product.creator.tag,
                        "uri": res.product.uri,
                    });
                }

                var res = await getCreatorShippingCountries(products[0].creator);
                var shippingDetails = res.shippingDetails;

                setProductsData(productsArray);
                setAvailableShippingCountries(shippingDetails);
                setCountry(Object.keys(shippingDetails)[0]);
                setShippingPrice(Object.values(shippingDetails)[0]);
            }
            getData();
        } else {
            navigate('/');
        }
        // first country in list
    }, []);

    const goToStripeCheckout = async event => {
        if(country && state && zipcode && value && firstName && lastName){
            if(loggedIn && !email || !loggedIn && email){
                setShippingAddress({
                    email: email,
                    country: country,
                    state: state,
                    zipcode: zipcode,
                    streetAddress: value,
                    firstName: firstName,
                    lastName: lastName,
                    shippingPrice: shippingPrice
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
                    var notLoggedInEmail = (email) ? email : "";
                    var checkoutUrl = await getCheckoutUrl(data, username, shippingPrice, notLoggedInEmail);
                    window.location.href = checkoutUrl;
                }
            }
        } else {
            Flash("Fill out all fields.", "dark");
        }
    }

    const onCountryChange = event => {
        setCountry(event.target.value);
        setShippingPrice(availableShippingCountries[event.target.value]);
    }

    return (
        <div id="payment-details-parent">
            <form id="payment-details-form">
                <div className="my-auto" id="payment-details-info">
                    <label className="form-label">EMAIL</label>
                    <input className="form-control mb-1" name="email" required onChange={handleInputChange} type="email" placeholder="johndoe@mail.com"/>
                    <div className="d-flex mb-2 w-100">
                        <div className="w-50">
                            <label className="form-label">FIRST NAME</label>
                            <input className="form-control" name="firstname" required onChange={handleInputChange} type="text" placeholder="John"/>
                        </div>
                        <div className="ps-1 w-50">
                            <label className="form-label">LAST NAME</label>
                            <input className="form-control" name="lastname" required onChange={handleInputChange} type="text" placeholder="Doe"/>
                        </div>
                    </div>
                    <label className="form-label">COUNTRY</label>
                    <select className="form-select mb-3" onChange={onCountryChange}>
                        {availableShippingCountries && Object.keys(availableShippingCountries).map((country, index) => {
                                return <option value={country} key={index}>{country}</option>
                            })
                        }
                    </select>
                    <label className="form-label">ADDRESS</label>
                    <input className="form-control mb-1" value={value} type="text" name="streetAddress" required onChange={handleAddressChange} placeholder="Street Name / Apt No."/>
                    {status === "OK" && <ul className="list-group mb-2">{renderSuggestions()}</ul>}
                    <input className="form-control mb-1" value={state} type="text" name="state" required onChange={handleInputChange} placeholder="City / State"/>
                    <input className="form-control mb-1" value={zipcode} type="text" name="zipcode" required onChange={handleInputChange} placeholder="Zipcode"/>
                </div>
                <div className="d-flex flex-row justify-content-evenly mt-auto" id="payment-details-totals-parent">
                    <div className="d-flex flex-column me-auto">
                        <span className="fs-2 fw-bold">TOTAL:&nbsp;
                            <span>£{total+shippingPrice}</span>
                        </span>
                        <span className="text-muted">Products:&nbsp;
                            <span>£{total}</span>
                        </span>
                        <span className="text-muted">Shipping:&nbsp;
                            <span>{shippingPrice > 0 ? "£"+shippingPrice : "Free"}</span>
                        </span>
                    </div>
                    <button onClick={goToStripeCheckout} className="btn btn-dark fw-bold w-50" type="button">BUY
                        <FaArrowRight className="icon-3"/></button>
                </div>
            </form>
        </div>
    )
}

export default PaymentDetails;