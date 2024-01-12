import { http } from "../../../../axios/init";
import { useState } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
import { PiWarningDiamondFill } from "react-icons/pi";

export function ModalDeletePreset(props) {
  const [submitDelete, setSubmitDelete] = useState(false);
  const idPreset = props.aPresets.substring(0, props.aPresets.indexOf("&"));
  const namePreset = props.aPresets.substring(props.aPresets.indexOf("&") + 1);
  const handleSuccessDelelePreset = () => {
    setSubmitDelete(true);
    http
      .delete(`presets/${idPreset}`, {
        headers: {
          Authorization: `Bearer ${props.getJWTToken}`,
        },
      })
      .then((res) => {
        props.handleModalDeletePresetClose();
        setSubmitDelete(false);
      });
  };
  return (
    <Modal
      show={props.showModalDeletePreset}
      onHide={props.handleModalDeletePresetClose}
      centered
    >
      <Modal.Header closeButton style={{ padding: "20px 20px 10px 50px" }}>
        <Modal.Title style={{ display: "flex", flexDirection: "row" }}>
          <PiWarningDiamondFill
            style={{ color: "red", scale: "1.2", marginRight: "12px" }}
          />
          <b style={{ fontSize: "20px" }}>Are you sure?</b>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ paddingLeft: "50px" }}>
        <p>
          Your action will delete the preset with name <b>{namePreset}</b>.
          Please beware this action CANNOT be undone.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={props.handleModalDeletePresetClose}
          variant="secondary"
        >
          Cancel{" "}
        </Button>

        <Button
          onClick={handleSuccessDelelePreset}
          variant="danger"
          disabled={submitDelete}
        >
          Yes, delete{" "}
          {submitDelete && (
            <Spinner
              animation="border"
              size="sm"
              style={{ verticalAlign: "middle" }}
            />
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
