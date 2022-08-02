import React, { useContext, useEffect, useState } from "react";
import "./ShoppingBasket.css";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router";

import { getProduct } from "../../controllers/gatekeepers";
import { CartContext } from "../../services/CartContext";

function ShoppingBasket() {
  const navigate = useNavigate();

  const { products, total } = useContext(CartContext);
  const [productsData, setProductsData] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const productsArray = [];
      const getData = async () => {
        const promises = [];
        for (let i = 0; i < products.length; i += 1) {
          promises.push(getProduct(products[i].uri, products[i].type));
        }
        const results = await Promise.all(promises);
        for (let i = 0; i < results.length; i += 1) {
          const res = results[i];
          productsArray.push({
            name: res.product.name,
            price: res.product.price,
            size: products[i].size,
            creator: res.product.creator.tag,
            uri: res.product.uri,
            image: res.product.images[res.product.imageOrder[0]],
          });
        }
        setProductsData(productsArray);
      };
      getData();
    }
  }, []);

  //   const removeFromBasket = (uri, price, index) => {
  //     removeFromCart({ uri, price });
  //     productsData.splice(index, 1);
  //     if (productsData.length > 0) setProductsData(productsData);
  //     else setProductsData(null);
  //   };

  const goToPaymentDetails = async () => {
    navigate("/payment-details");
  };

  return (
    <div id="shopping-basket-parent" className="pb-2 pt-1">
      <div>
        {productsData ? (
          productsData.map((product) => (
            <div className="shopping-basket-product-parent">
              <img
                className="shopping-basket-product-image"
                src={`/images/products/${product.image}`}
                alt="shopping basket"
              />
              <div className="my-auto ms-2 shopping-basket-product-details">
                <span className="shopping-basket-product-name">
                  {product.name.toUpperCase()}
                </span>
                <div>
                  <span className="text-muted">@{product.creator}</span>
                  <span className="shopping-basket-product-size">
                    {product.size.toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="shopping-basket-product-price">
                £{product.price}
              </span>
              <FaTimes className="shopping-basket-close-button" />
            </div>
          ))
        ) : (
          <div className="h-100 d-flex align-items-center">
            <span className="m-auto fs-1">Empty Cart</span>
          </div>
        )}
      </div>
      {productsData && (
        <div
          className="justify-content-evenly"
          id="shopping-basket-totals-parent"
        >
          <div id="shopping-basket-totals-amount" className="fs-2">
            <span>TOTAL:&nbsp;</span>
            <span>£{total}</span>
          </div>
          <button
            className="btn btn-dark fw-bold"
            type="button"
            onClick={goToPaymentDetails}
          >
            PROCEED
            <FaArrowRight className="icon-3" />
          </button>
        </div>
      )}
    </div>

    // productsData.map((product, index) => {
    // return (
    // <div key={index}>
    // {/* <img className="shopping-basket-product-image" src={`/images/products/${product.image}`} alt="product-image"/> */}
    // {/* <span className="shopping-basket-product-name fs-4">{product.name}</span> */}
    // {/* <div className="shopping-basket-product-info"> */}
    // {/* <span className="shopping-basket-product-creator">{product.creator}</span> */}
    // {/* <span className="shopping-basket-product-size">{product.size}</span> */}
    // {/* </div> */}
    // {/* <span className="shopping-basket-product-price">£{product.price}</span> */}
    // {/* <div className="shopping-basket-product-remove"> */}
    //                                        {/* <CloseButton onClick={() => removeFromBasket(product.uri, product.price, index)} variant="white"/> */}
    //                                    {/* </div> */}
    //                                {/* </div> */}
    //                            {/* </div> */}
    //                    // <div style={{height: '40vh', display: 'grid', placeItems: 'center'}}>
    //                        // <div>
    //                            // <span className="fs-3">CART IS EMPTY</span>
    //                            // <br/>
    //                            // <span className="go-to-products" onClick={() => navigate("/maksie_aki/own")}>Go to products</span>
    //                        // </div>
    //                    // </div>
    //                {/* } */}
    //            // </div>
    //            {/* {productsData && */}
    //                // <div id="shopping-basket-totals">
    //                    {/* <span className='fs-2 shopping-basket-total-work'>TOTAL:   £{total}</span> */}
    //                    {/* <Button className="shopping-basket-proceed" onClick={goToPaymentDetails} variant="dark">Proceed<FaArrowRight style={{marginLeft: '6px', marginBottom: '3px'}}/></Button> */}
    //                {/* </div> */}
    //            // }
    //        {/* </div> */}
  );
}

export default ShoppingBasket;
