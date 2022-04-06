import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../services/AuthContext';
import { getProducts, removeProduct } from '../../../controllers/gatekeepers';
import './Products.css';
import { useNavigate } from 'react-router';
import { Button, Form, Modal } from 'react-bootstrap';
import { Flash } from '../../../components/FlashMessage/FlashMessage';

const CreatorProducts = () => {
    let navigate = useNavigate();
    const { username, token } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(null)
    const [showRemoveProductModal, setShowRemoveProductModal] = useState(false);
    const [focusedProduct, setFocusedProduct] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            var data = await getProducts(username, token);
            if(data.success){
                setProducts(data.products);
                setFilteredProducts(data.products);
            } else navigate('/login');
        }
        fetch();
    }, [])

    const editProduct = (id) => {
        navigate(`edit/${id}`);
    }

    const showConfirmRemoveProduct = (id) => {
        setShowRemoveProductModal(true);
        setFocusedProduct(id);
    }

    const confirmRemoveProduct = async () => {
        var data = await removeProduct(focusedProduct, username, token);
        setShowRemoveProductModal(false);
        if(data.success){
            var newProducts = [];
            for(var i = 0; i < products.length; i++){
                if(products[i]._id !== focusedProduct) newProducts.push(products[i]);
            }
            setProducts(newProducts);
            setFilteredProducts(newProducts);
            Flash("Product Removed", "dark");
        }
        else Flash("Product not removed", "danger");
    }
    
    const searchInputChange = event => {
        setFilteredProducts(products.filter(e => {
            return e.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        }));
    }

    return (
        <div id="admin-products-parent">
            <Modal show={showRemoveProductModal} onHide={() => setShowRemoveProductModal(false)} centered>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div style={{display: 'grid', alignContent: 'center', textAlign: 'center', padding: '1rem'}}>
                        <span className="fs-5 mb-3">Confirm remove product</span>
                        <br/>
                        <Button onClick={confirmRemoveProduct} variant="danger" className="w-100">REMOVE</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <input type="text" onChange={searchInputChange} className="form-control w-100" placeholder="Filter products"/>
            <div id="admin-products" className="my-4">
                <div className="row g-3">
                    {filteredProducts && filteredProducts.length > 0 && filteredProducts.map((product, index) => (
                        <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3">
                            <div className="admin-product">
                                <img className="admin-product-image" src={`/images/products/${product.images[product.imageOrder[0]]}`}/>
                                <div className="text-center d-flex flex-column px-3">
                                    <span className="fs-4 fw-bold py-2">{product.name}</span>
                                    <div className="btn-group" role="group">
                                        <button onClick={() => editProduct(product._id)} className="btn btn-secondary" type="button">EDIT</button>
                                        <button onClick={() => showConfirmRemoveProduct(product._id)} className="btn btn-danger" type="button">DELETE</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    )
}

export default CreatorProducts;