import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../services/AuthContext';
import { getCreatorProducts } from '../../../controllers/creators';
import './Products.css';
import { useNavigate } from 'react-router';
import { Button, Form, Modal } from 'react-bootstrap';

const CreatorProducts = () => {
    let navigate = useNavigate();
    const { username } = useContext(AuthContext);
    const [products, setProducts] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState(null)
    const [searchTerm, setSearchTerm] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            var data = await getCreatorProducts(username);
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

    const removeProduct = (id) => {

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
            {filteredProducts && filteredProducts.map((product, index) => {
                return (
                    <div key={product.name} className="product mb-4">
                        <img src={`/images/products/${product.images[0]}`} className="product-image"/>
                        <div className="product-info w-100">
                            <span className="fs-4 text-muted fw-light">{product.name}</span>
                            <div className="creator-portal-product-edit-group">
                                <Button onClick={() => editProduct(product._id)} size="sm" className="mx-1 w-95" variant="secondary">EDIT</Button>
                                <Button onClick={removeProduct} size="sm" className="mx-1 w-95" variant="dark">REMOVE</Button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default CreatorProducts;