import { http } from "../../../../axios/init";
import { useState } from "react";
import {
  Button,
  Form,
  FormControl,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";
import { CgAddR } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";

export default function ModalProjectName(props) {
  const [validated, setValidated] = useState(false);
  const [editDisable, setEditDisable] = useState(true);
  const [editSaveChange, setEditSaveChange] = useState(false);
  const [projectName, setProjectName] = useState(
    props?.attributes?.ProjectName
  );
  const [ioTHubConnection, setIoTHubConnection] = useState(
    props?.attributes?.IoTHubConnectionString
  );
  const [signalRPath, setSignalRPath] = useState(
    props?.attributes?.SignalRPath
  );
  const handleClose = () => {
    props.setShowModalProjectName(false);
    setEditDisable(true);
    resetFormInitial();
  };
  const resetFormInitial = () => {
    setProjectName(props?.attributes?.ProjectName);
    setIoTHubConnection(props?.attributes?.IoTHubConnectionString);
    setSignalRPath(props?.attributes?.SignalRPath);
    setEditSaveChange(false);
  };
  const handleSuccessEditProject = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (projectName && ioTHubConnection && signalRPath) {
      setEditSaveChange(true);
      http
        .put(
          `azure-credentials/${props.id}`,
          {
            data: {
              ProjectName: projectName,
              IoTHubConnectionString: ioTHubConnection,
              SignalRPath: signalRPath,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${props.getJWTToken}`,
            },
          }
        )
        .then((res) => {
          handleClose();
        });
    }
  };
  return (
    <Modal show={props.showModalProjectName} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Project name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="custom-search-bar">
          <FormControl
            id="myInput"
            type="text"
            placeholder="Search"
            className="mr-sm-2 custom-input"
            style={{ width: "30% !important" }}
          />
        </Form>
        <Form noValidate validated={validated}>
          <Form.Group
            controlId="validationBusinessName"
            style={{
              margin: "5px 10px 15px 0",
              float: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Business name</Form.Label>

            <Form.Control
              type="text"
              value={props?.attributes?.business?.data?.attributes?.Name}
              disabled
            />
          </Form.Group>
          <Form.Group
            controlId="validationProjectName"
            style={{
              margin: "5px 10px 15px 0",
              float: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Project name</Form.Label>

            <Form.Control
              type="text"
              value={projectName}
              onChange={(evt) => setProjectName(evt.target.value)}
              required
              disabled={editDisable}
            />
            <Form.Control.Feedback type="invalid">
              Please enter name of project
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            controlId="validationIoTHubConnection"
            style={{
              margin: "5px",
              clear: "both",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>IoTHub Connection</Form.Label>

            <Form.Control
              type="text"
              value={ioTHubConnection}
              onChange={(e) => {
                setIoTHubConnection(e.target.value);
              }}
              as="textarea"
              rows={3}
              required
              disabled={editDisable}
            />
            <Form.Control.Feedback type="invalid">
              Please enter IoTHub Connection String
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            controlId="validationSignalRPath"
            style={{
              margin: "15px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>SignalR Path</Form.Label>

            <Form.Control
              type="text"
              value={signalRPath}
              onChange={(evt) => setSignalRPath(evt.target.value)}
              required
              as="textarea"
              rows={3}
              disabled={editDisable}
            />
            <Form.Control.Feedback type="invalid">
              Please enter SignalR Path
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={handleSuccessEditProject}
          variant="primary"
          //   disabled={submitEdit}
          style={{
            display: !editDisable ? "block" : "none",
          }}
          disabled={editSaveChange}
        >
          Save changes
          {editSaveChange && (
            <Spinner
              animation="border"
              size="sm"
              style={{ verticalAlign: "middle", marginLeft: "8px" }}
            />
          )}
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setEditDisable(!editDisable);
            resetFormInitial();
          }}
          disabled={editSaveChange}
        >
          {editDisable && <CiEdit style={{ display: "inline-block" }} />}
          {editDisable ? "Edit Project" : "Cancel Edit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
