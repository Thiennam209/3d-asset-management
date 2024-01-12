import { http } from "../../../../axios/init";
import { useEffect, useState } from "react";
import { Modal, Spinner, Button, Form } from "react-bootstrap";
import { PiWarningDiamondFill } from "react-icons/pi";

export function ModalEditPreset(props) {
  const [submitEdit, setSubmitEdit] = useState(false);
  const [validated, setValidated] = useState(false);
  const matchResult = props.idBusiness.match(/([^&]+)&id=(\d+)/);
  const idBusiness = matchResult ? matchResult[1] : "";
  const idDefaultBusiness = matchResult ? matchResult[2] : "";
  const idPreset = props.aPresets.substring(0, props.aPresets.indexOf("&"));
  const namePreset = props.aPresets.substring(props.aPresets.indexOf("&") + 1);
  const [presetName, setPresetName] = useState("");
  useEffect(() => {
    setPresetName(namePreset);
  }, [props.showModalEditPreset === true]);
  const handleSuccessEditPreset = (event) => {
    setSubmitEdit(true);
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (presetName) {
      http
        .put(
          `presets/${idPreset}`,
          {
            data: {
              preset: presetName,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${props.getJWTToken}`,
            },
          }
        )
        .then((res) => {
          props.handleModalEditPresetClose();
          setSubmitEdit(false);
        });
    } else {
      setSubmitEdit(false);
    }
  };
  return (
    <Modal
      show={props.showModalEditPreset}
      onHide={props.handleModalEditPresetClose}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Preset</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate validated={validated}>
          <Form.Group
            controlId="validationPresetName"
            style={{
              margin: "5px 10px 5px 0",
              float: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Business ID</Form.Label>

            <Form.Control type="text" value={idBusiness} disabled />
          </Form.Group>
          <Form.Group
            controlId="validationPresetName"
            style={{
              margin: "5px 10px 5px 0",
              float: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Preset name</Form.Label>

            <Form.Control
              type="text"
              value={presetName}
              onChange={(evt) => setPresetName(evt.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter name of preset
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.handleModalEditPresetClose} variant="secondary">
          Cancel{" "}
        </Button>

        <Button
          onClick={handleSuccessEditPreset}
          variant="primary"
          disabled={submitEdit}
        >
          Save changes
          {submitEdit && (
            <Spinner
              animation="border"
              size="sm"
              style={{ verticalAlign: "middle", marginLeft: "8px" }}
            />
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
