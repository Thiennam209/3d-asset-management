import "../styleDetail.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { http, urlStrapi } from "../../../../axios/init";
import Table from "react-bootstrap/Table";
import { Form, FormControl, Spinner, Image } from "react-bootstrap";
import { CgAddR } from "react-icons/cg";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { Textarea } from "@chakra-ui/react";
import { PiWarningDiamondFill } from "react-icons/pi";

const DetailPart = (item) => {
  const [validated, setValidated] = useState(false);
  const [showModalDetailPart, setShowModalDetailPart] = useState(false);
  const [showModalAddPart, setShowModalAddPart] = useState(false);
  const [showModalEditPart, setShowModalEditPart] = useState(false);
  const [showModalDeletePart, setShowModalDeletePart] = useState(false);
  const [part, setPart] = useState([]);
  const [partName, setPartName] = useState("");
  const [description, setDescription] = useState("");
  const [interaction, setInteraction] = useState("");
  const [arrInteraction, setArrInteraction] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [render, setRender] = useState(false);
  const [submitAdd, setSubmitAdd] = useState(false);
  const [submitEdit, setSubmitEdit] = useState(false);
  const [submitDelete, setSubmitDelete] = useState(false);
  const [aPart, setAPart] = useState([]);
  const [imgEdit, setImgEdit] = useState("");
  const [imgDisableEdit, setImgDisableEdit] = useState("block");

  const handleModalDetailPartClose = () => setShowModalDetailPart(false);
  const handleModalAddPartClose = () => {
    setShowModalAddPart(false);
    setShowModalDetailPart(true);
  };
  const handleModalEditPartClose = () => {
    setShowModalEditPart(false);
    setShowModalDetailPart(true);
    setPartName("");
    setDescription("");
    setInteraction("");
    setSelectedFile(null);
  };
  const handleModalDeletePartClose = () => {
    setShowModalDeletePart(false);
    setShowModalDetailPart(true);
  };
  const handleSuccessDelelePart = () => {
    setSubmitDelete(true);
    const idPart = aPart.id;
    http
      .delete(`/parts/${idPart}`, {
        headers: {
          Authorization: `Bearer ${item.getJWTToken}`,
        },
      })
      .then((res) => {
        http
          .delete(`/upload/files/${aPart.attributes.image.data.id}`, {
            headers: {
              Authorization: `Bearer ${item.getJWTToken}`,
            },
          })
          .then((res) => {
            setShowModalDeletePart(false);
            setShowModalDetailPart(true);
            setSubmitDelete(false);
            setRender(true);
          });
      });
  };
  useEffect(() => {
    const id = item.item.id;
    http
      .get(
        `/assets/${id}?populate[parts][populate]=image&populate[parts][populate]=part_interactions`,
        {
          headers: {
            Authorization: `Bearer ${item.getJWTToken}`,
          },
        }
      )
      .then((res) => {
        const data = res.data.data.attributes.parts.data;
        setPart(data);
      });
    http
      .get(`/part-interactions`, {
        headers: {
          Authorization: `Bearer ${item.getJWTToken}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        setArrInteraction(data);
        setInteraction(res.data.data[0].id);
        setRender(false);
      });
  }, [render]);
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên trong danh sách đã chọn
    // Kiểm tra phần mở rộng của tệp (extension)
    setImgDisableEdit("none");
    if (file === undefined) {
      setImgDisableEdit("block");
    }
    if (file) {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"]; // Các phần mở rộng cho tệp ảnh
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));
      if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        // Nếu phần mở rộng hợp lệ, lưu tệp vào state
        setSelectedFile(file);
      } else {
        // Nếu phần mở rộng không hợp lệ, đặt trường input về trạng thái trống
        e.target.value = null;
        setSelectedFile(null);
        console.error("Invalid file type. Please select an image file.");
      }
    }
  };
  const handleAddPart = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (partName && interaction && selectedFile) {
      let dataImg = new FormData();
      dataImg.append("files", selectedFile);
      setSubmitAdd(true);
      http
        .post("/upload", dataImg, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${item.getJWTToken}`,
          },
        })
        .then((res) => {
          const formData = {
            asset: item.item.id,
            name: partName,
            displayname: partName,
            part_interactions: interaction,
            description: description,
            cover: false,
            image: res.data[0].id,
          };
          http
            .post(
              `/parts`,
              { data: formData },
              {
                headers: {
                  Authorization: `Bearer ${item.getJWTToken}`,
                },
              }
            )
            .then((res) => {
              setShowModalAddPart(false);
              setShowModalDetailPart(true);
              setSubmitAdd(false);
              setPartName("");
              setDescription("");
              setSelectedFile(null);
              setValidated(false);
              setRender(true);
            });
        });
    }
  };
  const handleEditPart = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (partName && interaction) {
      if (selectedFile) {
        let dataImg = new FormData();
        dataImg.append("files", selectedFile);
        setSubmitEdit(true);
        http
          .post("/upload", dataImg, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${item.getJWTToken}`,
            },
          })
          .then((res) => {
            http
              .put(
                `/parts/${aPart.id}`,
                {
                  data: {
                    name: partName,
                    displayname: partName,
                    description: description,
                    part_interactions:
                      interaction !== undefined ? interaction : null,
                    image: res.data[0].id,
                  },
                },
                {
                  headers: {
                    Authorization: `Bearer ${item.getJWTToken}`,
                  },
                }
              )
              .then((res) => {
                setSubmitEdit(false);
                setPartName("");
                setDescription("");
                setInteraction("");
                setShowModalEditPart(false);
                setShowModalDetailPart(true);
                setRender(true);
              })
              .catch((err) => console.log(err));
          });
      } else {
        setSubmitEdit(true);
        http
          .put(
            `/parts/${aPart.id}`,
            {
              data: {
                name: partName,
                displayname: partName,
                description: description,
                part_interactions:
                  interaction !== undefined ? interaction : null,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${item.getJWTToken}`,
              },
            }
          )
          .then((res) => {
            setSubmitEdit(false);
            setPartName("");
            setDescription("");
            setInteraction("");
            setShowModalEditPart(false);
            setShowModalDetailPart(true);
            setRender(true);
          });
      }
    }
  };

  console.log(render);
  return (
    <>
      <div
        className="btnDetailPart"
        onClick={(e) => {
          e.stopPropagation();
          setShowModalDetailPart(true);
        }}
      >
        <p>Detail Part</p>
      </div>

      <Modal
        show={showModalDetailPart}
        onHide={handleModalDetailPartClose}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detail Part</Modal.Title>
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
            <Button
              variant="primary"
              style={{ margin: "15px 10px 15px 60px" }}
              onClick={() => {
                setShowModalAddPart(true);
                setShowModalDetailPart(false);
              }}
            >
              <CgAddR style={{ display: "inline-block" }} /> Add New Part
            </Button>
          </Form>
          <Table striped className="text-center">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Image</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {part.map((data, index) => {
                return (
                  <tr key={index}>
                    <td style={{ verticalAlign: "middle" }}>{index + 1}</td>
                    <td style={{ verticalAlign: "middle" }}>
                      {data.attributes.displayname}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {data.attributes.description}
                    </td>
                    <td style={{ padding: "0", verticalAlign: "middle" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          style={{
                            borderRadius: "5%",
                            width: "100",
                            height: "auto",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                          }}
                          src={`${urlStrapi}/${data?.attributes?.image?.data?.attributes?.url}`}
                          alt="null"
                        />
                      </div>
                    </td>
                    <td style={{ padding: "0", verticalAlign: "middle" }}>
                      <Button
                        variant="success"
                        style={{ margin: "5px" }}
                        onClick={() => {
                          setAPart(data);
                          setPartName(data?.attributes?.displayname);
                          setDescription(data?.attributes?.description);
                          setInteraction(
                            data?.attributes?.part_interactions?.data[0]?.id
                          );
                          setImgEdit(
                            data?.attributes?.image?.data?.attributes?.url
                          );
                          setShowModalEditPart(true);
                          setShowModalDetailPart(false);
                          setImgDisableEdit("block");
                        }}
                      >
                        <CiEdit style={{ display: "inline-block" }} />
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setAPart(data);
                          setShowModalDeletePart(true);
                          setShowModalDetailPart(false);
                        }}
                      >
                        <MdDeleteForever style={{ display: "inline-block" }} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModalAddPart}
        onHide={handleModalAddPartClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Part</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group
              controlId="validationAssetName"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Asset name</Form.Label>

              <Form.Control
                type="text"
                value={item.item.attributes.name}
                disabled
              />
            </Form.Group>

            <Form.Group
              controlId="validationPartName"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Part name</Form.Label>

              <Form.Control
                type="text"
                value={partName}
                onChange={(e) => {
                  setPartName(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter name of part
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationDescription"
              style={{
                margin: "5px 0",
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
                rows={5}
              />
            </Form.Group>
            <Form.Group
              controlId="validationPartInteraction"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Part Interaction</Form.Label>

              <Form.Select
                onChange={(e) => {
                  setInteraction(e.target.value);
                }}
                required
              >
                {arrInteraction.map((data, index) => {
                  return (
                    <option key={index} value={data.id}>
                      {data.attributes.name}
                    </option>
                  );
                })}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                Please enter part interaction
              </Form.Control.Feedback>
            </Form.Group>
            <br />
            <Form.Group className="position-relative mb-3">
              <Form.Label>
                <b>Image</b>
              </Form.Label>

              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png, .gif" // Xác định phần mở rộng cho tệp ảnh
                required
                name="file"
                onChange={handleFileChange}
              />

              <Form.Control.Feedback type="invalid">
                Please choose the correct image with format :
                <b>&ensp;. jpg &ensp;. jpeg &ensp;. png &ensp;. gif</b>
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalAddPartClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleAddPart}
            disabled={submitAdd}
          >
            Save Changes
            {submitAdd && (
              <Spinner
                animation="border"
                size="sm"
                style={{ verticalAlign: "middle", marginLeft: "8px" }}
              />
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModalDeletePart}
        onHide={handleModalDeletePartClose}
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
            Your action will delete the part with name{" "}
            <b>{aPart?.attributes?.displayname}</b>. Please beware this action
            CANNOT be undone.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={handleModalDeletePartClose} variant="secondary">
            Cancel{" "}
          </Button>

          <Button
            onClick={handleSuccessDelelePart}
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

      <Modal
        show={showModalEditPart}
        onHide={handleModalEditPartClose}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Part</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated}>
            <Form.Group
              controlId="validationAssetName"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Asset name</Form.Label>

              <Form.Control
                type="text"
                value={item.item.attributes.name}
                disabled
              />
            </Form.Group>

            <Form.Group
              controlId="validationPartName"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Part name</Form.Label>

              <Form.Control
                type="text"
                value={partName}
                onChange={(e) => {
                  setPartName(e.target.value);
                }}
                required
              />

              <Form.Control.Feedback type="invalid">
                Please enter name of part
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              controlId="validationDescription"
              style={{
                margin: "5px 0",
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
                rows={5}
              />
            </Form.Group>
            <Form.Group
              controlId="validationPartInteraction"
              style={{
                margin: "5px 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Form.Label>Part Interaction</Form.Label>

              <Form.Select
                value={interaction}
                onChange={(e) => {
                  setInteraction(e.target.value);
                }}
                required
              >
                {arrInteraction.map((data, index) => {
                  return (
                    <option key={index} value={data.id}>
                      {data.attributes.name}
                    </option>
                  );
                })}
              </Form.Select>

              <Form.Control.Feedback type="invalid">
                Please enter part interaction
              </Form.Control.Feedback>
            </Form.Group>
            <br />
            <Form.Group className="position-relative mb-3">
              <Form.Label>
                <b>Image</b>
              </Form.Label>
              <Image
                src={`${urlStrapi}/${imgEdit}`}
                rounded
                style={{ width: "40%", display: imgDisableEdit }}
              />
              <br />
              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png, .gif" // Xác định phần mở rộng cho tệp ảnh
                name="file"
                onChange={handleFileChange}
              />

              <Form.Control.Feedback type="invalid">
                Please choose the correct image with format :
                <b>&ensp;. jpg &ensp;. jpeg &ensp;. png &ensp;. gif</b>
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalEditPartClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleEditPart}
            disabled={submitEdit}
          >
            Save Changes
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
    </>
  );
};

export default DetailPart;
