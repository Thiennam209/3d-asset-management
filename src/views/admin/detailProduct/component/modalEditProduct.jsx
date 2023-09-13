import { http } from "../../../../axios/init";
import { useState, useRef, useEffect } from "react";
import {
  Modal,
  Form,
  FormControl,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  ListGroup,
  Image,
  Container,
} from "react-bootstrap";
const ModalEditProduct = ({
  showModalEditProduct,
  handleModalEditProductClose,
  data,
  getJWTToken,
}) => {
  const [validated, setValidated] = useState(false);
  const [productName, setProductName] = useState(data[0].attributes.title);
  const [productId, setProductId] = useState(data[0].attributes.productId);
  const [productDescription, setProductDescription] = useState(
    data[0].attributes.description
  );
  const [imageSrc, setImageSrc] = useState(data[0].attributes.thumbnail);
  const [file, setFile] = useState(null);
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
    http
      .get(`/products?filters[productId][$eq]=${productId}`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        const getID = res.data.data[0].id;
        if (file === null) {
          http.put(
            `/products/${getID}`,
            {
              data: {
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
            handleModalEditProductClose()
          })
        } else {
        }
      });
    console.log("formData :", formData);
  };
  const handleButtonImgClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setImageSrc(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <Modal
        show={showModalEditProduct}
        onHide={handleModalEditProductClose}
        size="lg"
      >
        <Modal.Header closeButton style={{ padding: "20px 20px 10px 50px" }}>
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
            {/* <Form.Group
              controlId="validationProductId"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Product Id</Form.Label>
              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter product Id"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter product id
              </Form.Control.Feedback>
            </Form.Group> */}

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
                <Button onClick={handleButtonImgClick} variant="dark">
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
              />
              {/* <Form.Control.Feedback type="invalid">
                Please choose the correct image with format :{" "}
                <b>&ensp;. jpg &ensp;. jpeg &ensp;. png &ensp;. gif</b>
              </Form.Control.Feedback> */}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalEditProductClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalEditProduct;
