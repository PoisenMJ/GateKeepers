import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import Compressor from "compressorjs";
import heic2any from "heic2any";
// eslint-disable-next-line import/no-relative-packages
import styled from "styled-components";
import { Button, Carousel, Col, Form, InputGroup } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
// eslint-disable-next-line import/no-relative-packages
import DateTimePicker from "../../../components/react-datetime-picker";
import Main from "../../../components/Main";
import { Flash } from "../../../components/FlashMessage/FlashMessage";
import { addProduct } from "../../../controllers/creators";
import { AuthContext } from "../../../services/AuthContext";
import styles from "./Upload.module.css";
import PageTemplate from "../../../components/PageTemplate";
import CreatorNavbar from "../Navbar/CreatorNavbar";

const UploadForm = styled.form`
  padding: 15px;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadImageText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
`;

const Parent = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 45% 55%;
  grid-template-rows: 100%;
  grid-template-areas: "left right";
`;
const Left = styled.div`
  grid-area: left;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  min-height: 0; /* NEW */
  min-width: 0; /* NEW; needed for Firefox */
`;
const Right = styled.div`
  grid-area: right;
  margin: auto;
  display: grid;
  width: 50%;
`;

function Upload() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("made");
  const [count, setCount] = useState(0);
  const [sizes, setSizes] = useState([]);
  const [date, setDate] = useState(new Date());

  const [imageOrder, setImageOrder] = useState([]);
  const { username, token } = useContext(AuthContext);

  const handleInputChange = (event) => {
    switch (event.target.name) {
      case "name":
        setName(event.target.value);
        break;
      case "price":
        setPrice(event.target.value);
        break;
      case "description":
        setDescription(event.target.value);
        break;
      case "type":
        setType(event.target.value);
        break;
      case "count":
        setCount(event.target.value);
        break;
      default:
        console.log("Case not handled");
        break;
    }
  };

  const updateSizes = (event, index) => {
    const newSizes = [...sizes];
    newSizes[index] = event.target.value;
    setSizes(newSizes);
  };
  const addSize = () => {
    const newSizes = sizes;
    newSizes.push("empty");
    setSizes([...newSizes]);
  };
  const deleteSize = (index) => {
    const newSizes = sizes;
    newSizes.splice(index, 1);
    setSizes([...newSizes]);
  };

  const openFileInput = () => document.getElementById("image-input").click();
  const updateOrder = (event, index) => {
    const order = imageOrder;
    imageOrder[index] = parseInt(event.target.value, 10) - 1;
    setImageOrder([]);
    setImageOrder(order);
  };

  useEffect(() => {
    const imageInput = document.getElementById("image-input");
    imageInput.onchange = async function (event) {
      const list = [];
      const order = [];
      const promises = [];
      for (let i = 0; i < event.target.files.length; i += 1) {
        // compress images
        if (i <= 10) {
          let workingFile;
          if (event.target.files[i].type.toLowerCase() === "image/heic") {
            const currentFile = event.target.files[i];
            promises.push(
              heic2any({
                blob: currentFile,
                toType: "image/jpg",
                quality: 1,
              })
            );
          } else workingFile = event.target.files[i];
          // eslint-disable-next-line no-new
          new Compressor(workingFile, {
            quality: 0.7,
            success(result) {
              const newFile = new File([result], result.name, {
                type: result.type,
              });
              list.push(newFile);
              if (i === event.target.files.length - 1) {
                setImages(list);
              }
            },
          });
          order.push(i);
        } else break;
      }

      if (promises.length > 0) {
        const results = await Promise.all(promises);
        for (let i = 0; i < results.length; i += 1) {
          const convertedImage = results[i];
          const filename = event.target.files[i].name.split(".");
          const workingFile = new File(
            [convertedImage],
            `${filename.slice(0, filename.length - 1).join("")}.png`,
            {
              type: convertedImage.type,
            }
          );
          // eslint-disable-next-line no-new
          new Compressor(workingFile, {
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
      }
      setImageOrder(order);
    };
  }, []);

  const sendAddProduct = async (event) => {
    event.preventDefault();
    const formdata = document.getElementById("admin-upload-form");

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
      if (images && price && name && description && type && count && sizes) {
        const res = await addProduct(
          formdata,
          username,
          token,
          imageOrder,
          images,
          sizes,
          date.getTime()
        );
        if (res.success) {
          Flash("Successfully added", "success");
          navigate("../products");
        } else Flash("Failed", "dark");
      } else {
        Flash("Fill all fields", "dark");
      }
    } else {
      Flash("Orders invalid", "dark");
    }
  };

  const ClearImages = () => {
    setImages([]);
  };

  return (
    <PageTemplate>
      <CreatorNavbar />
      <Main>
        <UploadForm onSubmit={sendAddProduct} id="admin-upload-form">
          <Parent>
            <Left>
              <Carousel className="slide mb-1" data-bs-ride="carousel">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <Carousel.Item
                      className={
                        index === 0 ? "h-100 active pointer" : "h-100 pointer"
                      }
                      onClick={openFileInput}
                      role="button"
                      tabIndex={0}
                    >
                      <CarouselImage
                        className="w-100 d-block"
                        src={URL.createObjectURL(image)}
                        alt="slide"
                      />
                    </Carousel.Item>
                  ))
                ) : (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                  <Carousel.Item
                    className="active pointer bg-primary h-100"
                    onClick={openFileInput}
                    role="button"
                    tabIndex={0}
                  >
                    <CarouselImage
                      className="w-100 d-block"
                      alt="slide"
                    />
                    <UploadImageText>Click to upload image..</UploadImageText>
                  </Carousel.Item>
                )}
              </Carousel>
              <div>
                {images.length > 0 &&
                  images.map((image, index) => {
                    const imageSRC =
                      typeof image === "string"
                        ? `/images/products/${image}`
                        : URL.createObjectURL(image);
                    return (
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        xl={2}
                        xxl={2}
                        className={["col-3", styles.imageOrderParent]}
                      >
                        <img
                          src={imageSRC}
                          className={[styles.imageOrderImage]}
                          alt="admin-upload"
                        />
                        <Form.Control
                          onChange={(e) => updateOrder(e, index)}
                          defaultValue={index + 1}
                          className={[styles.imageOrderInput]}
                          type="number"
                          min="1"
                          step="1"
                        />
                      </Col>
                    );
                  })}
                <Button
                  variant="warning"
                  className="w-100 mb-2 mt-2 fw-bold"
                  onClick={ClearImages}
                >
                  CLEAR IMAGES
                </Button>
                <Form.Control
                  // onChange={handleInputChange}
                  className="visually-hidden"
                  id="image-input"
                  type="file"
                />
              </div>
            </Left>
            <Right>
              <Form.Control
                onChange={handleInputChange}
                className="mb-2"
                name="name"
                type="text"
                placeholder="PRODUCT NAME"
                size="lg"
              />
              <Form.Control
                as="textarea"
                onChange={handleInputChange}
                name="description"
                className={["mb-2", styles.description]}
                type="text"
                placeholder="DESCRIPTION..."
              />
              <InputGroup className={["mb-2", styles.priceInputParent]}>
                <InputGroup.Text className={["bg-dark text-light fw-bold", styles.priceInputLabel]}>£</InputGroup.Text>
                <Form.Control
                  onChange={handleInputChange}
                  name="price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={styles.priceInput}
                />
              </InputGroup>
              <Form.Control
                onChange={handleInputChange}
                name="count"
                type="number"
                placeholder="NO. OF PRODUCTS"
                pattern="[0-9]*"
                min="0"
                step="1"
                className="mb-1"
              />
              <DateTimePicker
                initialValue={date}
                closeOnSelect
                className={["mb-2 mt-1 w-100 pointer", styles.datePicker]}
                calendarClassName={styles.datePicker}
                calendarIcon={null}
                onChange={(val) => {
                  setDate(val);
                }}
                value={date}
                inputProps={{
                  placeholder: "Upload Date...",
                  className: "w-100 form-control bg-white pointer",
                  readOnly: true,
                }}
              />
              <div className="mb-4">
                {sizes.length > 0 &&
                  sizes.map((size, index) => (
                    <div className="mb-1 d-flex flex-row">
                      <Form.Control
                        type="text"
                        value={size}
                        onChange={(e) => updateSizes(e, index)}
                        placeholder="ENTER SIZE"
                      />
                      <Button
                        variant="secondary"
                        className="ms-2"
                        onClick={() => deleteSize(index)}
                        type="button"
                      >
                        <FaTimes style={{ marginBottom: 4 }} />
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="dark"
                  className="w-100 mb-1 fw-bold"
                  onClick={addSize}
                  type="button"
                >
                  ADD SIZE
                </Button>
              </div>
              <Button
                variant="success"
                size="lg"
                className="fw-bold w-100"
                type="submit"
              >
                CREATE
              </Button>
            </Right>
          </Parent>
        </UploadForm>
      </Main>
    </PageTemplate>
  );
}

export default Upload;
