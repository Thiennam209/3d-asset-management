import { useState } from "react";
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
} from "react-bootstrap";
const ModalAddNewPartner = ({
  showModalAddPartner,
  handleModalAddPartnerClose,
}) => {
  const [validated, setValidated] = useState(false);
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const handleEdit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    const formData = {
      productName,
    };
  };
  return (
    <>
      <Modal
        show={showModalAddPartner}
        onHide={handleModalAddPartnerClose}
        size="lg"
      >
        <Modal.Header closeButton style={{ padding: "20px 20px 10px 50px" }}>
          <Modal.Title>
            <b style={{ fontSize: "32px" }}>Add new partner</b>
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
            <Form.Group
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
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter product description
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalAddPartnerClose}>
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

export default ModalAddNewPartner;
