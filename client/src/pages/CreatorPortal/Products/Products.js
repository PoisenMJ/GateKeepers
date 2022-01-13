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
    const [products, setProducts] = useState(null);
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
        setProducts(products.filter(e => e._id != focusedProduct));
        if(data.success) Flash("Product Removed", "dark");
        else Flash("Product not removed", "danger");
    }
    
    const searchInputChange = event => {
        setFilteredProducts(products.filter(e => {
            return e.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
        }));
    }

    return (
        <div id="creator-products-portal">
            <Form>
                <Form.Control onChange={searchInputChange} type="text" placeholder="Search for product name..." className="custom-input mb-2 border2"/>
            </Form>
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
            {filteredProducts && filteredProducts.map((product, index) => {
                return (
                    <div key={product.name} className="product mb-4">
                        <img src={`/images/products/${product.images[0]}`} className="product-image"/>
                        <div className="product-info w-100">
                            <span className="fs-4 text-muted fw-light">{product.name}</span>
                            <div className="creator-portal-product-edit-group">
                                <Button onClick={() => editProduct(product._id)} size="sm" className="mx-1 w-95" variant="secondary">EDIT</Button>
                                <Button onClick={() => showConfirmRemoveProduct(product._id)} size="sm" className="mx-1 w-95" variant="dark">REMOVE</Button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CreatorProducts;