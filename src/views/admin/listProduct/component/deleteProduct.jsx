import { PiWarningDiamondFill } from "react-icons/pi";

import { useState } from "react";

import axios from "axios";

import {
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";

import { http } from "../../../../axios/init";

const DeleteProduct = ({
  showModalDeleteProduct,
  handleModalDeleteProductClose,
  getJWTToken,
  dataDelete,
  onSubmitSuccessDelete,
  setIsButtonDeleteDisabled
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const dataAssets = dataDelete?.attributes?.assets?.data;
  const handleFinnish = () => {
    setIsButtonDisabled(true);
    setIsButtonDeleteDisabled(true)
    setIsProcessing(true)
    http
      .delete(`products/${dataDelete.id}`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        dataAssets.forEach((item, index) => {
          http
            .delete(`assets/${item.id}`, {
              headers: {
                Authorization: `Bearer ${getJWTToken}`,
              },
            }).then((resp) => {
              axios(
                `https://api.sketchfab.com/v3/models/${item.attributes.assetUID}`,
                {
                  method: "DELETE",

                  headers: {
                    Authorization: "Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN",
                  },
                }
              ).then((response) => {

              }).catch((err) => {
                
              })
            })


        })

        onSubmitSuccessDelete(
          `Delete a product with name ${dataDelete?.attributes?.title} was successful.`
        );
        setIsButtonDisabled(false);
        setIsProcessing(false)
        handleModalDeleteProductClose();

      });
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
