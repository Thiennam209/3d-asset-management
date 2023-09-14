import { http } from "../../../../axios/init";
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
  getJWTToken
}) => {
  const [validated, setValidated] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [manager, setManager] = useState("");
  const handleModalClose = () => {
    setPartnerName("");
    setPartnerId("");
    setManager("");
    setValidated(false);
    handleModalAddPartnerClose();
  };
  const handleEdit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    const formData = {
      partnerName,
    };
    if (partnerName && partnerId && manager) {
      http.post(`/businesses`, {
        data : {
          Name: partnerName,
          businessId: partnerId,
          Manager: manager
        }
      },
      {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        console.log("ressss::::", res);
        handleModalAddPartnerClose()
      })
    }
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
            Fill out the following details as prompted below to create new a
            partner profile to your business list.
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
              controlId="validationPartnerId"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Partner Id</Form.Label>
              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter partner id"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter partner id
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              controlId="validationPartnerName"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Partner name</Form.Label>

              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter partner name"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter product name
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              controlId="validationManager"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Manager</Form.Label>
              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter Manager"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please enter manager
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
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
