import { React, useEffect, useState } from 'react';
import './CreatorsOwnPage.css';
import { getWornByProducts } from '../../controllers/creators';
import { useParams } from 'react-router-dom';

const CreatorPage = () => {
    const [products, setProducts] = useState(null);
    const {creator} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            var posts = await getWornByProducts(creator);
            setProducts(posts);
        }
        fetchData();
    }, [])

    return (
        <div id="creator-page">
            <div className="w-100 text-center mb-3">
                <span className="text-muted text-uppercase quote">Worn by @{creator}</span>
            </div>
            <hr className="mx-5"/>
            <div id="creator-own-products">
                {products && products.map((product, index) => {
                    return (
                        <div key={product._id} className="creator-own-product mb-4">
                            <img src={`/images/products/${product.images[0]}`} className="creator-own-product-image"/>
                            <div className="creator-own-product-info">
                                <span className="fs-4 text-muted fw-light">{product.name}</span>
                                <span className="fs-5">${product.price}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CreatorPage;