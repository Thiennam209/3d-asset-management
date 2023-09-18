import { http } from "../../../../axios/init";
import { useEffect, useState } from "react";
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
import { BsFillExclamationCircleFill } from "react-icons/bs";
const ModalAddNewPartner = ({
  showModalAddPartner,
  handleModalAddPartnerClose,
  getJWTToken,
  setIsButtonAddDisabled,
  onSubmitSuccess,
}) => {
  const [validated, setValidated] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [manager, setManager] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [alertMessageAdd, setAlertMessageAdd] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên trong danh sách đã chọn

    // Kiểm tra phần mở rộng của tệp (extension)

    if (file) {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"]; // Các phần mở rộng cho tệp ảnh

      const fileExtension = file.name.substring(file.name.lastIndexOf("."));

      if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        // Nếu phần mở rộng hợp lệ, lưu tệp vào state

        setSelectedFile(file);

        console.log("Selected File:", file);
      } else {
        // Nếu phần mở rộng không hợp lệ, đặt trường input về trạng thái trống

        e.target.value = null;

        setSelectedFile(null);

        console.error("Invalid file type. Please select an image file.");
      }
    }
  };

  const handleModalClose = () => {
    setPartnerName("");
    setPartnerId("");
    setManager("");
    setValidated(false);
    handleModalAddPartnerClose();
  };
  const handleAddPartner = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    const formData = {
      partnerName,
      selectedFile,
    };
    if (partnerName && partnerId && manager && selectedFile) {
      const dataImg = new FormData();
      dataImg.append("files", selectedFile);

      // Gửi yêu cầu POST để tải ảnh lên Strapi (thay thế URL bằng URL thực tế của Strapi)
      http
        .get(`/businesses?filters[businessId][$eq]=${partnerId}&populate=*`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getJWTToken}`,
          },
        })
        .then((res) => {
          const duplicateId = res.data.data.length;
          if (duplicateId > 0) {
            setAlertMessageAdd(true);
            setPartnerId("");
            setValidated(true);
            // return;
          } else {
            setIsButtonAddDisabled(true);
            setIsProcessing(true);
            setIsButtonDisabled(true);
            http
              .post("/upload", dataImg, {
                headers: {
                  "Content-Type": "multipart/form-data",

                  Authorization: `Bearer ${getJWTToken}`,
                },
              })
              .then((res) => {
                const imgId = res.data[0].id;
                http
                  .post(
                    `/businesses`,
                    {
                      data: {
                        Name: partnerName,
                        businessId: partnerId,
                        Manager: manager,
                        avatar: imgId,
                      },
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${getJWTToken}`,
                      },
                    }
                  )
                  .then((res) => {
                    handleModalAddPartnerClose();
                    setIsProcessing(false);
                    setIsButtonDisabled(false);
                    onSubmitSuccess(
                      `Add new partner with name ${formData.partnerName} was successful.`
                    );
                    setPartnerName("");
                    setPartnerId("");
                    setManager("");
                    setValidated(false);
                  });
              });
          }
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
        show={showModalAddPartner}
        onHide={handleModalAddPartnerClose}
        size="lg"
      >
        <Modal.Header style={{ padding: "20px 20px 10px 50px" }}>
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

              {alertMessageAdd ? (
                <div style={{ fontSize: "80%", color: "#dc3545" }}>
                  <BsFillExclamationCircleFill
                    style={{ display: "inline", margin: "5px 10px" }}
                  />
                  <b>Duplication partner id</b>! Please choose diferrent partner id.
                </div>
              ) : (
                <Form.Control.Feedback type="invalid">
                  Please enter product id
                </Form.Control.Feedback>
              )}
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
            <br />
            <Form.Group className="position-relative mb-3">
              <Form.Label>
                <b>Avatar</b>
              </Form.Label>

              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png, .gif" // Xác định phần mở rộng cho tệp ảnh
                required
                name="file"
                onChange={handleFileChange}
                style={{ width: "513px" }}
              />

              <Form.Control.Feedback type="invalid">
                Please choose the correct image with format :{" "}
                <b>&ensp;. jpg &ensp;. jpeg &ensp;. png &ensp;. gif</b>
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
            onClick={handleAddPartner}
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

export default ModalAddNewPartner;
