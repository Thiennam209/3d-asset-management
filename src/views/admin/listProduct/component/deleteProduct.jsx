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

const DeleteProduct = ({
  showModalDeleteProduct,
  handleModalDeleteProductClose,
  getJWTToken,
  dataDelete,
  onSubmitSuccessDelete,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const handleFinnish = () => {
    setIsButtonDisabled(true);
    http
      .delete(`products/${dataDelete.id}`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        onSubmitSuccessDelete(
          `Delete a product with name ${dataDelete?.attributes?.title} was successful.`
        );
        setIsButtonDisabled(false);
      });
    handleModalDeleteProductClose();
  };
  const handleCancel = () => {
    handleModalDeleteProductClose();
  };
  return (
    <Modal
      show={showModalDeleteProduct}
      onHide={handleModalDeleteProductClose}
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
          Your action will delete <b>{dataDelete?.attributes?.title}</b>. Please
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

export default DeleteProduct;
