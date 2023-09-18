import { http, urlStrapi } from "../../../../axios/init";
import { useState, useRef, useEffect } from "react";
import {
  Modal,
  Form,
  FormControl,
  Button,
  Row,
  Col,
  Card,
  ListGroup,
  Image,
  Container,
  Spinner,
  Alert,
} from "react-bootstrap";
import { BsFillExclamationCircleFill } from "react-icons/bs";
const ModalEditProduct = ({
  showModalEditProduct,
  handleModalEditProductClose,
  data,
  getJWTToken,
  onSubmitSuccessEdit,
  dataEdit,
  handleNewProductId,
}) => {
  const [validated, setValidated] = useState(false);
  const [productName, setProductName] = useState(data[0].attributes.title);
  const [productId, setProductId] = useState(data[0].attributes.productId);
  const [productTryoutLink, setProductTryoutLink] = useState(
    data[0].attributes?.tryoutLink
  );
  const [newProductId, setNewProductId] = useState(
    data[0].attributes.productId
  );
  const [productDescription, setProductDescription] = useState(
    data[0].attributes.description
  );
  const [imageSrc, setImageSrc] = useState(
    `${urlStrapi}/${data[0]?.attributes?.testImage?.data?.attributes?.url}`
  );
  const [file, setFile] = useState(null);
  const [limitedSizeThumb, setLimitedSizeThumb] = useState(false);
  const MAX_FILE_SIZE_THUMB = 300 * 1024; // KB

  const [isProcessing, setIsProcessing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isButtonImgDisabled, setIsButtonImgDisabled] = useState(false);
  const [alertMessageEdit, setAlertMessageEdit] = useState(false);
  const fileInputRef = useRef(null);
  const handleEdit = (event) => {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    const formData = {
      productName,
      //   productId,
      productDescription,
      file,
    };
    if (newProductId && productName && productDescription) {
      http
        .get(`/products?filters[productId][$eq]=${productId}&populate=*`, {
          headers: {
            Authorization: `Bearer ${getJWTToken}`,
          },
        })
        .then((res) => {
          const duplicateId = res.data.data.length;
          if (productId !== newProductId && duplicateId > 0) {
            setAlertMessageEdit(true);
            setNewProductId("");
            setValidated(true);
            // return;
          } else {
            setIsProcessing(true);
            setIsButtonDisabled(true);
            setIsButtonImgDisabled(true);
            const getID = res.data.data[0].id;
            const imgID = res.data.data[0].attributes.testImage.data.id;
            if (file === null) {
              http
                .put(
                  `/products/${getID}`,
                  {
                    data: {
                      productId: newProductId,
                      tryoutLink: productTryoutLink,
                      title: productName,
                      description: productDescription,
                    },
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${getJWTToken}`,
                    },
                  }
                )
                .then((res) => {
                  handleModalEditProductClose();
                  setIsProcessing(false);
                  setIsButtonDisabled(false);
                  setIsButtonImgDisabled(false);
                  onSubmitSuccessEdit(
                    `Edit a product with name ${productName} was successful.`
                  );
                  handleNewProductId(newProductId);
                });
            } else {
              http
                .delete(`/upload/files/${imgID}`, {
                  headers: {
                    Authorization: `Bearer ${getJWTToken}`,
                  },
                })
                .then((res) => {
                  const dataImg = new FormData();
                  dataImg.append("files", file);
                  http
                    .post("/upload", dataImg, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${getJWTToken}`,
                      },
                    })
                    .then((res) => {
                      const imgId = res.data[0].id;
                      http
                        .put(
                          `/products/${getID}`,
                          {
                            data: {
                              productId: newProductId,
                              tryoutLink: productTryoutLink,
                              title: productName,
                              description: productDescription,
                              testImage: imgId,
                            },
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${getJWTToken}`,
                            },
                          }
                        )
                        .then((res) => {
                          handleModalEditProductClose();
                          setIsProcessing(false);
                          setIsButtonDisabled(false);
                          setIsButtonImgDisabled(false);
                          onSubmitSuccessEdit(
                            `Edit a product with name ${productName} was successful.`
                          );
                          handleNewProductId(newProductId);
                        });
                    });
                });
              console.log("imageSrc :", data[0].attributes.thumbnail);
              console.log("file :", file);
            }
          }
        });
      setValidated(false);
    }
  };
  const handleButtonImgClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > MAX_FILE_SIZE_THUMB) {
      // TODO
      setLimitedSizeThumb(true);
      setFile(null);
    } else {
      setLimitedSizeThumb(false);

      if (file) {
        setFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          setImageSrc(imageUrl);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  if (alertMessageEdit) {
    setTimeout(() => {
      setAlertMessageEdit(false);
    }, 3000);
  }
  if(limitedSizeThumb) {
    setTimeout(()=>{
      setLimitedSizeThumb(false)
    }, 2000)
  }
  return (
    <>
      <Modal
        show={showModalEditProduct}
        onHide={handleModalEditProductClose}
        size="lg"
      >
        <Modal.Header style={{ padding: "20px 20px 10px 50px" }}>
          <Modal.Title>
            <b style={{ fontSize: "32px" }}>Edit Product</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ marginLeft: "50px" }}>
          <p>
            Fill out the following details as prompted below to edit a product
            profile to your product list.
          </p>
          <Form
            noValidate
            validated={validated}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "540px",
              paddingLeft: "0px",
              margin: "30px 0",
            }}
          >
            <Form.Group>
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter Product ID"
                value={newProductId}
                onChange={(e) => setNewProductId(e.target.value)}
                required
              />

              {alertMessageEdit ? (
                <div style={{ fontSize: "80%", color: "#dc3545" }}>
                  <BsFillExclamationCircleFill
                    style={{ display: "inline", margin: "5px 10px" }}
                  />
                  <b>Duplication id</b>! Please choose diferrent product id.
                </div>
              ) : (
                <Form.Control.Feedback type="invalid">
                  Please enter product id
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group
              controlId="validationProductName"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Product name</Form.Label>

              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter product name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
              <Form.Label>Try out link</Form.Label>
              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter product try out link"
                value={productTryoutLink}
                onChange={(e) => setProductTryoutLink(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              controlId="validationProductDescription"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Product description</Form.Label>
              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter Product description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                as="textarea"
                rows={5}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter product description
              </Form.Control.Feedback>
            </Form.Group>
            <br />
            <Form.Group className="position-relative mb-3">
              <Form.Label>
                <b>Product Thumbnail</b>
              </Form.Label>
              <div>
                <Row style={{ width: "60%" }}>
                  <Col>
                    <Image src={imageSrc} rounded />
                  </Col>
                </Row>
                <br />
                <Button
                  onClick={handleButtonImgClick}
                  variant="dark"
                  disabled={isButtonImgDisabled}
                >
                  Change Image
                </Button>{" "}
              </div>
              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png, .gif" // Xác định phần mở rộng cho tệp ảnh
                // required
                name="file"
                onChange={handleFileChange}
                style={{ width: "513px", display: "none" }}
                ref={fileInputRef}
                isInvalid={limitedSizeThumb}
              />
              <Form.Control.Feedback type="invalid">
                <>
                  This file is too big to load. Please limit the file to &lt;
                  300kB
                </>
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalEditProductClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleEdit}
            disabled={isButtonDisabled}
          >
            Save Changes{" "}
            {isProcessing && (
              <Spinner
                animation="border"
                size="sm"
                style={{ verticalAlign: "middle" }}
              />
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEditProduct;
