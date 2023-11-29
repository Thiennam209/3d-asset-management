import { http } from "../../../../axios/init";
import { useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import {
  roleManagerAll,
  roleManagerBusiness,
  roleUser,
} from "../../../../const/roles";
const ModalAddPeople = ({
  showModalAddPeople,
  handleModalAddPeopleClose,
  getJWTToken,
  setIsButtonAddPeopleDisabled,
  onSubmitSuccess,
  idBusiness,
  roleName,
}) => {
  const [validated, setValidated] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [alertMessageAdd, setAlertMessageAdd] = useState(false);

  let arrRole = [];

  switch (roleName) {
    case "roleManagerAll":
      arrRole = [...roleManagerBusiness, ...roleUser];
      break;
    case "roleManagerBusiness":
      arrRole = [...roleManagerBusiness, ...roleUser];
      break;
    default:
      arrRole = [];
  }
  const handleModalClose = () => {
    setUserName("");
    setEmail("");
    setValidated(false);
    handleModalAddPeopleClose();
  };
  const handleAddPeople = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (userName && email && password && role) {
      setIsButtonAddPeopleDisabled(true);
      setIsProcessing(true);
      setIsButtonDisabled(true);
      http
        .post(
          "/users",
          {
            username: userName,
            email: email,
            password: password,
            role: role,
            businessId: idBusiness,
            userType: "3dcms",
          },
          {
            headers: {
              Authorization: `Bearer ${getJWTToken}`,
            },
          }
        )
        .then((res) => {
          handleModalAddPeopleClose();
          setIsProcessing(false);
          setIsButtonDisabled(false);
          onSubmitSuccess(
            `Add new people with name ${userName} was successful.`
          );
          setUserName("");
          setEmail("");
          setRole("");
          setPassword("");
          setValidated(false);
        })
        .catch((err) => {
          handleModalAddPeopleClose();
          setIsProcessing(false);
          setIsButtonDisabled(false);
          onSubmitSuccess(`Fail`);
          setUserName("");
          setEmail("");
          setPassword("");
          setValidated(false);
        });
    }
  };
  if (alertMessageAdd) {
    setTimeout(() => {
      setAlertMessageAdd(false);
    }, 3000);
  }
  return (
    <>
      <Modal
        show={showModalAddPeople}
        onHide={handleModalAddPeopleClose}
        size="lg"
      >
        <Modal.Header style={{ padding: "20px 20px 10px 50px" }}>
          <Modal.Title>
            <b style={{ fontSize: "32px" }}>Add new people</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ marginLeft: "50px" }}>
          <p>
            Fill out the following details as prompted below to create new a
            people profile to your business.
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
              <Form.Label>Business Id</Form.Label>
              <Form.Control
                style={{ width: "513px" }}
                type="text"
                value={idBusiness}
                disabled={true}
                required
              />
            </Form.Group>

            <Form.Group
              controlId="validationUserName"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Username</Form.Label>

              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                maxLength={30}
              />

              <Form.Control.Feedback type="invalid">
                Please enter username
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              controlId="validationPassword"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Password</Form.Label>

              <Form.Control
                style={{ width: "513px" }}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={30}
              />

              <Form.Control.Feedback type="invalid">
                Please enter password
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationEmail"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Email</Form.Label>
              <Form.Control
                style={{ width: "513px" }}
                type="text"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={30}
              />
              <Form.Control.Feedback type="invalid">
                Please enter email
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationRole"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Role</Form.Label>

              <Form.Select
                aria-label="Select role"
                style={{ width: "513px" }}
                onChange={(event) => setRole(Number(event.target.value))}
                value={role}
                required
              >
                <option value="">Choose role</option>
                {arrRole.map((item, index) => {
                  return (
                    <option value={item.id} key={index}>
                      {item.role}
                    </option>
                  );
                })}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                Please enter role
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleAddPeople}
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

export default ModalAddPeople;
