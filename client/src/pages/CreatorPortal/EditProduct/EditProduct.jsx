import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Compressor from 'compressorjs';
import heic2any from 'heic2any';
// eslint-disable-next-line import/no-relative-packages
import DateTime from "../../../components/react-datetime-picker";
import { getProduct, updateProduct } from '../../../controllers/creators';
import { AuthContext } from '../../../services/AuthContext';
import { Flash } from '../../../components/FlashMessage/FlashMessage';
import './EditProduct.css';

function EditProduct() {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const { username, token } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [cleared, setCleared] = useState(false);
  const [imageOrder, setImageOrder] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [customSize, setCustomSize] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const data = await getProduct(productID, username, token);
      setProduct(data.product);
      setImages(data.product.images);
      setSizes(data.product.sizes);
      setImageOrder(data.product.imageOrder);
      setCustomSize(data.product.customSize);
    };
    fetch();

    const imageInput = document.getElementById('creator-portal-image-input');
    imageInput.onchange = (event) => {
      const list = [];
      const order = [];
      for (let i = 0; i < event.target.files.length; i += 1) {
        // compress images
        if (i <= 10) {
          if (event.target.files[i].type.toLowerCase() === 'image/heic') {
            const currentFile = event.target.files[i];
            heic2any({ blob: currentFile, toType: 'image/jpg', quality: 0.75 }).then((convertedImage) => {
              const newFile = new File([convertedImage], currentFile.name, {
                type: convertedImage.type,
              });
              list.push(newFile);
              setImages([]);
              if (i === event.target.files.length) {
                setImages(list);
              }
            });
          } else {
            /* eslint-disable-next-line no-new */
            new Compressor(event.target.files[i], {
              quality: 0.7,
              success(result) {
                const newFile = new File([result], result.name, {
                  type: result.type,
                });
                list.push(newFile);
                setImages([]);
                if (i === event.target.files.length) {
                  setImages(list);
                }
              },
            });
          }
          order.push(i);
        } else break;
      }
      setImages(list);
      setCleared(true);
      setImageOrder(order);
    };
  }, []);

  const updateCustomSize = (event) => setCustomSize(event.target.checked);
  const clearImages = () => { setImages([]); };

  const addImage = () => {
    document.getElementById('creator-portal-image-input').click();
  };

  const updateOrder = (event, index) => {
    const order = imageOrder;
    order[index] = parseInt(event.target.value, 10) - 1;
    setImageOrder([]);
    setImageOrder(order);
  };

  const updateSizes = (event, index) => {
    const newSizes = sizes;
    sizes[index] = event.target.value;
    setSizes([]);
    setSizes(newSizes);
  };
  const addSize = () => {
    const newSizes = sizes;
    newSizes.push('empty');
    setSizes([...newSizes]);
  };
  const deleteSize = (index) => {
    const newSizes = sizes;
    newSizes.splice(index, 1);
    setSizes([...newSizes]);
  };

  const sendUpdateForm = async (event) => {
    event.preventDefault();

    // check order is valid
    let orderTotal = 0;
    let desiredTotal = 0;
    for (let i = 0; i < images.length; i += 1) {
      if (imageOrder[i] <= images.length - 1) {
        orderTotal += imageOrder[i];
      } else orderTotal += 100;
      desiredTotal += i;
    }

    if (orderTotal === desiredTotal) {
      const form = document.getElementById('admin-upload-form');
      const data = new FormData(form);

      data.append('productID', productID);
      data.append('price', document.getElementById('edit-money-input').value);
      data.append('sizes', sizes);
      // send if images are changed or not
      if (product.images !== images) data.append('imagesChanged', true);
      else data.append('imagesChanged', false);
      data.append('images', images);
      data.append('imagesCleared', cleared);
      data.append('imageOrder', imageOrder);
      data.append('customSize', customSize);

      const res = await updateProduct(data, username, token);
      if (res.success) Flash('Product Updated', 'dark');
      else Flash('Product failed to update', 'danger');
    } else {
      Flash('Order invalid', 'danger');
    }
  };

  return (
    <form id="admin-upload-form" onSubmit={sendUpdateForm}>
      {product
                && <input className="form-control mb-2" defaultValue={product.name} type="text" id="admin-upload-product-name" placeholder="Product Name" />}
      <input className="visually-hidden" id="creator-portal-image-input" type="file" />
      <div className="carousel slide mb-1" data-bs-ride="carousel" id="admin-upload-images">
        <div className="carousel-inner" id="admin-upload-images-slides">
          {images.length > 0 ? images.map((image, index) => {
            const imageSRC = (typeof image === 'string') ? `/images/products/${image}` : URL.createObjectURL(image);
            return (
              <div className={index === 0 ? 'carousel-item h-100 active' : 'carousel-item h-100'}>
                <img className="w-100 d-block admin-upload-slide-image" src={imageSRC} alt="slide" />
              </div>
            );
          })
            : (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div className="carousel-item active h-100 pointer admin-empty-slide" onClick={addImage} role="button" tabIndex="0">
                <img className="w-100 d-block admin-upload-slide-image" src="/images/default.jpg" alt="empty slide" />
                <span id="admin-upload-initial-slide-text">Click to upload image..</span>
              </div>
            )}
        </div>
        <div>
          <a className="carousel-control-prev" href="#admin-upload-images" role="button" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" />
            <span className="visually-hidden">Previous</span>
          </a>
          <a className="carousel-control-next" href="#admin-upload-images" role="button" data-bs-slide="next">
            <span className="carousel-control-next-icon" />
            <span className="visually-hidden">Next</span>
          </a>
        </div>
        <ol className="carousel-indicators">
          {images.length > 0 && images.map((i, ind) => (
            <li data-bs-target="#admin-upload-images" data-bs-slide-to={ind} className={ind === 0 ? 'active' : ''} />
          ))}
        </ol>
      </div>
      <button onClick={clearImages} className="btn btn-danger w-100 btn-sm" type="button">CLEAR IMAGES</button>
      <div id="admin-upload-image-order-parent" className="mb-2">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label className="form-label">IMAGE ORDER</label>
        <div className="row g-0">
          {images.length > 0 && images.map((image, index) => {
            const imageSRC = (typeof image === 'string') ? `/images/products/${image}` : URL.createObjectURL(image);
            return (
              <div className="col-3 col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2 admin-upload-image-order">
                <img className="admin-upload-image-order-image" src={imageSRC} alt="order" />
                <input
                  onChange={(e) => updateOrder(e, index)}
                  defaultValue={index + 1}
                  className="form-control admin-upload-image-order-input"
                  type="number"
                  min="1"
                  step="1"
                />
              </div>
            );
          })}
        </div>
      </div>
      {product
                && (
                <>
                  <div className="input-group mb-1">
                    <span className="input-group-text">£</span>
                    <input name="price" defaultValue={product ? product.price : 0} className="form-control" type="number" placeholder="0.00" min="0" step="0.01" />
                  </div>
                  <input name="description" className="form-control mb-1" type="text" defaultValue={product ? product.description : 'description'} placeholder="Description" />
                  <DateTime
                    initialValue={new Date(product ? product.dateToPost : '')}
                    closeOnSelect
                    className="mb-2 mt-2 w-100"
                    inputProps={{
                      placeholder: 'Upload Date...',
                      className: 'date-input-upload-form form-control w-100 bg-white',
                      readOnly: true,
                      name: 'dateToPost',
                    }}
                  />
                  <select name="type" className="form-select mb-1" defaultValue={product ? product.type : 'made'}>
                    <option value="own" selected="">Own</option>
                    <option value="made">Made</option>
                  </select>
                  <input defaultValue={product ? product.count : 0} name="count" className="form-control mb-3" type="number" placeholder="Number of products" min="0" step="1" />
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label className="form-label">SIZES</label>
                  <div id="admin-upload-product-sizes-parent" className="mb-4">
                    {sizes.length > 0 && sizes.map((size, index) => (
                      <div className="admin-upload-product-size mb-1">
                        <input
                          className="form-control"
                          type="text"
                          value={size}
                          onChange={(e) => updateSizes(e, index)}
                          placeholder="ENTER SIZE"
                        />
                        <button className="btn btn-dark ms-2" onClick={() => deleteSize(index)} type="button">DELETE</button>
                      </div>
                    ))}
                    <button className="btn btn-secondary w-100 mb-1" onClick={addSize} type="button">ADD SIZE</button>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="formCheck-1" />
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label defaultValue={product ? product.customSize : false} onChange={updateCustomSize} className="form-check-label" htmlFor="formCheck-1">Allow Custom Size</label>
                    </div>
                  </div>
                  <button className="btn btn-success btn-lg w-100" type="submit">UPDATE</button>
                </>
                )}
    </form>
  );
}

export default EditProduct;
