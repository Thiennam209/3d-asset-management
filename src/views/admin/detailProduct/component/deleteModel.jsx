import { Box, Icon } from "@chakra-ui/react";

import { MdOutlineEdit, MdAdd } from "react-icons/md";
import { PiWarningDiamondFill } from "react-icons/pi";

import { useEffect, useState } from "react";

import {
  Form,
  FormControl,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Spinner,
  ListGroup,
  Image,
} from "react-bootstrap";

import axios from "axios";

import { http, urlStrapi } from "../../../../axios/init";

const DeleteModel = ({
  showModalDeleteModel,
  handleModalDeleteModelClose,
  getJWTToken,
  tokenSket,
  dataDelete,
  onSubmitSuccessDelete
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFinnish = () => {
    setIsButtonDisabled(true);
    setIsProcessing(true)
    http
      .delete(`assets/${dataDelete.id}`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        axios(
          `https://api.sketchfab.com/v3/models/${dataDelete.attributes.assetUID}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + tokenSket,
            },
          }
        ).then((response) => {

          setIsButtonDisabled(false);
          setIsProcessing(false)
          handleModalDeleteModelClose();
        }).catch((err) => {
          setIsButtonDisabled(false);
          setIsProcessing(false)
          handleModalDeleteModelClose();
        })
        onSubmitSuccessDelete(
          `Delete a 3D model was successful.`
        );
      }).catch((err) => {
        setIsButtonDisabled(false);
        setIsProcessing(false)
        handleModalDeleteModelClose();
        onSubmitSuccessDelete(
          `Fail`
        );
      })
  };
  const handleCancel = () => {
    handleModalDeleteModelClose();
  };
  return (
    <Modal
      show={showModalDeleteModel}
      onHide={handleModalDeleteModelClose}
      centered
    >
      <Modal.Header closeButton style={{ padding: "20px 20px 10px 50px" }}>
        <Modal.Title style={{ display: "flex", flexDirection: "row" }}>
          <PiWarningDiamondFill
            style={{ color: "red", scale: "1.2", marginRight: "12px" }}
          />{" "}
          <b style={{ fontSize: "20px" }}>Are you sure?</b>{" "}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ paddingLeft: "50px" }}>
        <p>
          Your action will delete a 3D model. Please
          beware this action CANNOT be undone.
        </p>
      </Modal.Body>

      <Modal.Footer>
        {/* <Button variant="secondary" onClick={handleModalInitClose}>
          Cancel
        </Button> */}
        <Button onClick={handleCancel} variant="secondary">
          Cancel{" "}
        </Button>

        <Button
          onClick={handleFinnish}
          variant="danger"
          disabled={isButtonDisabled}
        >
          Yes, delete{" "}
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
  );
};

export default DeleteModel;
