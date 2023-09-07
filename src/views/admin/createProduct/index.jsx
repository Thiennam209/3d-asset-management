import { Box, Icon } from "@chakra-ui/react";
import { MdOutlineEdit, MdAdd } from "react-icons/md";
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
} from "react-bootstrap";
import axios from "axios";
import { http, urlStrapi } from "../../../axios/init";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import ProgressBar from "react-bootstrap/ProgressBar";
const CreateProduct = ({
  showModalAddProduct,
  handleModalAddProductClose,
  getJWTToken,
  getIDBusiness,
  onSubmitSuccess,
}) => {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [validated, setValidated] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên trong danh sách đã chọn
    // Kiểm tra phần mở rộng của tệp (extension)
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
  const handleFilesChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên trong danh sách đã chọn
    // Kiểm tra phần mở rộng của tệp (extension)
    if (file) {
      const allowedExtensions = [".obj", ".blend", ".fbx", ".gltf", ".glb"]; // Các phần mở rộng cho tệp ảnh
      const fileExtension = file.name.substring(file.name.lastIndexOf("."));

      if (allowedExtensions.includes(fileExtension.toLowerCase())) {
        // Nếu phần mở rộng hợp lệ, lưu tệp vào state
        setSelectedFiles(file);
      } else {
        // Nếu phần mở rộng không hợp lệ, đặt trường input về trạng thái trống
        e.target.value = null;
        setSelectedFiles(null);
        console.error("Invalid file type. Please select an image file.");
      }
    }
  };
  const handleFinnish = (event) => {
    const form = event.currentTarget;
    const formData = {
      productName,
      productId,
      brand,
      stock,
      productDescription,
      getIDBusiness,
      selectedFile,
      selectedFiles,
    };
    debugger;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (
      productName !== "" &&
      productId !== "" &&
      brand !== "" &&
      stock !== "" &&
      productDescription !== "" &&
      selectedFile !== null &&
      selectedFiles !== null &&
      getIDBusiness
    ) {
      setIsButtonDisabled(true);
      setIsProcessing(true);
      const dataImg = new FormData();
      dataImg.append("files", selectedFile);
      const formDataSketchfab = new FormData();
      formDataSketchfab.append("modelFile", selectedFiles);
      formDataSketchfab.append("isInspectable", true);
      formDataSketchfab.append("license", "by");
      // Gửi yêu cầu POST để tải ảnh lên Strapi (thay thế URL bằng URL thực tế của Strapi)
      http
        .post("/upload", dataImg, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getJWTToken}`,
          },
        })
        .then((res) => {
          const urlImg = `${urlStrapi}${res.data[0].url}`;
          http.post(
            "/products",
            {
              data: {
                title: formData.productName,
                description: formData.productDescription,
                stock: formData.stock,
                brand: formData.brand,
                productId: formData.productId,
                businessId: formData.getIDBusiness,
                thumbnail: urlImg,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${getJWTToken}`,
              },
            }
          );
        });

      axios("https://api.sketchfab.com/v3/models", {
        method: "POST",
        headers: { Authorization: `Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN` },
        data: formDataSketchfab,
      }).then((res) => {
        if (res.status === 201) {
          const uidResponse = res.data.uid;
          var data = {
            data: {
              assetUID: uidResponse,
              description: formData.productName,
              productId: formData.productId,
              isPublished: true,
              thumbnail: "null",
            },
          };

          http.post("assets", data, {
            headers: {
              Authorization: `Bearer ${getJWTToken}`,
            },
          });
          onSubmitSuccess(
            `Create new product with name ${formData.productName} was successful.`
          );
          handleModalInitClose();
          setIsButtonDisabled(false);
          setIsProcessing(false);
        }
      });
    } else {
      console.error("Please select an image.");
    }
  };
  const handleModalInitClose = () => {
    handleModalAddProductClose();
    setProductName("");
    setProductId("");
    setBrand("");
    setStock("");
    setProductDescription("");
    setValidated(false);
  };
  return (
    <Modal
      show={showModalAddProduct}
      onHide={handleModalAddProductClose}
      size="lg"
    >
      <Modal.Header closeButton style={{ padding: "20px 20px 10px 50px" }}>
        <Modal.Title>
          <b style={{ fontSize: "32px" }}>Create new product</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ marginLeft: "50px" }}>
        <p>
          Fill out the following details as prompted below to add a new product
          profile to your product list.
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
            controlId="validationProductName"
            style={{
              margin: "5px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Product name</Form.Label>
            <Form.Control
              style={{ width: "513px" }}
              type="text"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter product name
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            controlId="validationProductId"
            style={{
              margin: "5px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Product Id</Form.Label>
            <Form.Control
              style={{ width: "513px" }}
              type="text"
              placeholder="Enter product Id"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter product id
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            controlId="validationBrand"
            style={{
              margin: "5px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Brand</Form.Label>
            <Form.Control
              style={{ width: "513px" }}
              type="text"
              placeholder="Enter Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter brand
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            controlId="validationStock"
            style={{
              margin: "5px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Stock</Form.Label>
            <Form.Control
              style={{ width: "513px" }}
              type="number"
              placeholder="Enter Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter quantity in stock
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            controlId="validationProductDescription"
            style={{
              margin: "5px 0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Form.Label>Product description</Form.Label>
            <Form.Control
              style={{ width: "513px" }}
              type="text"
              placeholder="Enter Product description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter product description
            </Form.Control.Feedback>
          </Form.Group>
          <br />
          <Form.Group className="position-relative mb-3">
            <Form.Label>
              <b>Product Thumbnail</b>
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
          <br />
          <Form.Group className="position-relative mb-3">
            <Form.Label>
              <b style={{ fontSize: "22px" }}>3D model</b>
              <p>Upload 3D models of your product here.</p>
            </Form.Label>
            <Form.Control
              style={{ width: "513px" }}
              type="file"
              multiple
              onChange={handleFilesChange}
              accept=".obj*, .blend, .fbx, .gltf, .glb"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose the correct image with format :{" "}
              <b>
                &ensp;. obj* &ensp;. blend &ensp;. fbx &ensp;. gltf &ensp;. glb
              </b>
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalInitClose}>
          Cancel
        </Button>
        <Button
          onClick={handleFinnish}
          variant="primary"
          disabled={isButtonDisabled}
        >
          Finish{" "}
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
export default CreateProduct;
