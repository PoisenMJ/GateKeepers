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
            <input type="text" className="form-control w-100" placeholder="Filter products"/>
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
        // <div id="creator-products-portal">
        //     <Form className="mb-3">
        //         <Form.Control onChange={searchInputChange} type="text" placeholder="Search for product name..." className="custom-input mb-2 border2"/>
        //     </Form>
        //     <Modal show={showRemoveProductModal} onHide={() => setShowRemoveProductModal(false)} centered>
        //         <Modal.Header closeButton></Modal.Header>
        //         <Modal.Body>
        //             <div style={{display: 'grid', alignContent: 'center', textAlign: 'center', padding: '1rem'}}>
        //                 <span className="fs-5 mb-3">Confirm remove product</span>
        //                 <br/>
        //                 <Button onClick={confirmRemoveProduct} variant="danger" className="w-100">REMOVE</Button>
        //             </div>
        //         </Modal.Body>
        //     </Modal>
        //     <div id="creator-portal-product-list">
        //     {filteredProducts && filteredProducts.length > 0 && filteredProducts.map((product, index) => {
        //         return (
        //             <div key={product._id} className="product mb-4" style={{boxShadow: '1px 1px #3E3E3E, 2px 2px #3E3E3E, 3px 3px #3E3E3E, 4px 4px #3E3E3E, 5px 5px #3E3E3E, 6px 6px #3E3E3E, 7px 7px #3E3E3E, 8px 8px #3E3E3E'}}>
        //                 <div className="product-image-parent">
        //                     <img src={`/images/products/${product.images[product.imageOrder[0]]}`} className="product-image"/>
        //                 </div>
        //                 <div className="product-info w-100">
        //                     <span className="fs-4 text-muted fw-light mb-2">{product.name} <span className='text-primary'>({product.type})</span></span>
        //                     <div className="creator-portal-product-edit-group">
        //                         <Button onClick={() => editProduct(product._id)} size="sm" className="mx-1 w-95" variant="secondary">EDIT</Button>
        //                         <Button onClick={() => showConfirmRemoveProduct(product._id)} size="sm" className="mx-1 w-95" variant="dark">REMOVE</Button>
        //                     </div>
        //                 </div>
        //             </div>
        //         )
        //     })}
        //     </div>
        // </div>
    )
}

export default CreatorProducts;