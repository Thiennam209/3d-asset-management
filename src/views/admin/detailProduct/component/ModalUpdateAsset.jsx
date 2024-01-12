import { http } from "../../../../axios/init";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Spinner, Form } from "react-bootstrap";
import { Textarea } from "@chakra-ui/react";
export function ModalUpdateAsset(props) {
  const [dataAsset, setDataAsset] = useState(null);
  const [validated, setValidated] = useState(false);
  const [listMachineId, setListMachineId] = useState([]);
  const [assetName, setAssetName] = useState("");
  const [machineId, setMachineId] = useState("");
  const [description, setDescription] = useState("");
  const [visibleSubmit, setVisibleSubmit] = useState(false);
  const [file3D, setFile3D] = useState(null);
  const [isButton3DModelDisabled, setIsButton3DModelDisabled] = useState(false);
  const handleUpdateAsset = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (assetName) {
      setVisibleSubmit(true);
      setIsButton3DModelDisabled(true);
      if (file3D === null) {
        http
          .put(
            `assets/${props.dataAsset.id}`,
            {
              data: {
                name: assetName,
                digital_twin_factory_machine: machineId || null,
                description: description,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${props.getJWTToken}`,
              },
            }
          )
          .then((res) => {
            setVisibleSubmit(false);
            setIsButton3DModelDisabled(false);
            props.handleModalUpdateAssetClose();
          });
      } else {
        const formData = new FormData();
        formData.append("modelFile", file3D);
        formData.append("isInspectable", true);
        formData.append("license", "by");
        axios("https://api.sketchfab.com/v3/models", {
          method: "POST",
          headers: { Authorization: "Bearer " + props.tokenSket },
          data: formData,
        }).then((res) => {
          const uuid = res.data.uid;
          http
            .put(
              `assets/${props.dataAsset.id}`,
              {
                data: {
                  name: assetName,
                  digital_twin_factory_machine: machineId || null,
                  description: description,
                  assetUID: uuid,
                  thumbnail: "null"
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${props.getJWTToken}`,
                },
              }
            )
            .then((res) => {
              setVisibleSubmit(false);
              setIsButton3DModelDisabled(false);
              props.handleModalUpdateAssetClose();
            });
        });
      }
    }
  };

  const handleFileChange3DModel = (event) => {
    // Handle file selection here, e.g., access selected file details
    const file = event.target.files[0];
    if (file) {
      setFile3D(file);
    } else {
      setFile3D(null);
    }
  };

  useEffect(() => {
    setValidated(false);
    if (props.dataAsset.id) {
      http
        .get(`assets/${props.dataAsset.id}?populate=*`, {
          headers: {
            Authorization: `Bearer ${props.getJWTToken}`,
          },
        })
        .then((res) => {
          setDataAsset(res);
          setAssetName(res.data.data.attributes.name);
          setMachineId(
            res.data.data.attributes.digital_twin_factory_machine.data?.id || ""
          );
          setDescription(res.data.data.attributes.description);
        });
    }
    http
      .get(`digital-twin-factory-machines`, {
        headers: {
          Authorization: `Bearer ${props.getJWTToken}`,
        },
      })
      .then((res) => {
        setListMachineId(res.data);
      });
  }, [props.showModalUpdateAsset === true]);
  return (
    <>
      <Modal
        show={props.showModalUpdateAsset}
        onHide={props.handleModalUpdateAssetClose}
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Asset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dataAsset === null ? (
            <div>
              <Spinner animation="border" />
            </div>
          ) : (
            <Form noValidate validated={validated}>
              <Form.Group
                controlId="validationProductName"
                style={{
                  margin: "5px 10px 5px 0",
                  float: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label>Product name</Form.Label>

                <Form.Control
                  type="text"
                  value={
                    dataAsset.data.data.attributes.product.data.attributes.title
                  }
                  disabled
                />
              </Form.Group>

              <Form.Group
                controlId="validationAssetName"
                style={{
                  margin: "5px 10px 5px 0",
                  float: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label>Asset name</Form.Label>

                <Form.Control
                  type="text"
                  value={assetName}
                  onChange={(e) => {
                    setAssetName(e.target.value);
                  }}
                  required
                />

                <Form.Control.Feedback type="invalid">
                  Please enter name of asset
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group
                controlId="validationMachineId"
                style={{
                  margin: "5px 10px 5px 0",
                  float: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label>Machine id</Form.Label>

                <Form.Select
                  value={machineId}
                  onChange={(e) => {
                    setMachineId(e.target.value);
                  }}
                >
                  <option value="">Choose option</option>
                  {listMachineId.data.map((data, index) => {
                    return (
                      <option key={index} value={data.id}>
                        {data.attributes.MachineId}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>

              <Form.Group
                controlId="validationDescription"
                style={{
                  margin: "5px",
                  clear: "both",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Form.Label>Description</Form.Label>

                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                  as={Textarea}
                  rows={3}
                />
              </Form.Group>

              <div>
                <br />
                <h3>
                  <b>3D Model</b>
                </h3>
                {file3D !== null ? (
                  <li style={{ marginBottom: "10px" }}>{file3D.name}</li>
                ) : (
                  <iframe
                    id="api-frame-detail"
                    data-uid={props.dataAsset.attributes.assetUID}
                    title="xxx"
                    frameBorder="0"
                    allowFullScreen=""
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    xr-spatial-tracking=""
                    execution-while-out-of-viewport=""
                    execution-while-not-rendered=""
                    web-share=""
                    src={`https://sketchfab.com/models/${props.dataAsset.attributes.assetUID}/embed`}
                    style={{
                      width: "50%",
                      margin: "20px 0",
                      borderRadius: "10px",
                    }}
                  ></iframe>
                )}

                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  accept=".obj*, .blend, .fbx, .gltf, .glb, .zip"
                  onChange={handleFileChange3DModel}
                />
                <Button
                  onClick={() => document.getElementById("fileInput").click()}
                  variant="dark"
                  disabled={isButton3DModelDisabled}
                >
                  Change 3D Model
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={props.handleModalUpdateAssetClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateAsset}
            disabled={visibleSubmit}
          >
            Save Changes
            {visibleSubmit && (
              <Spinner
                animation="border"
                size="sm"
                style={{ verticalAlign: "middle", marginLeft: "8px" }}
              />
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
