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

  setIsButtonAddDisabled

}) => {

  const [productName, setProductName] = useState("");

  const [productId, setProductId] = useState("");

  const [productDescription, setProductDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState(null);

  const [validated, setValidated] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  //   const [show, setShow] = useState(false);

  //   const [selectFile, enableUploadButton] = useState(false);

  // const [percentage, animateProgress] = useState(0);

  //   const [file, setFile] = useState(null);

  //   const [onUploading, setStatusUpload] = useState(false);

  //   const [uid, setUid] = useState("");

 

  //   const getJWTToken = localStorage.getItem("dtvt");

  //   const handleClose = () => {

  //     setShow(false);

  //     enableUploadButton(false);

  //     animateProgress(0);

  //   };

 

  //   const handleFileChange = (event) => {

  //     setFile(event.target.files[0]);

  //     enableUploadButton(true);

  //   };

 

  //   const handleSubmit = async (event) => {

  //     console.log(`handleSubmit: process ${percentage}`);

  //     setStatusUpload(true);

  //     enableUploadButton(false);

 

  //     const formData = new FormData();

  //     formData.append("modelFile", file);

  //     formData.append("isInspectable", true);

  //     formData.append("license", "by");

 

  //     try {

  //       // Upload model to Sketchfab

  //       const response = await axios("https://api.sketchfab.com/v3/models", {

  //         method: "POST",

  //         headers: { Authorization: `Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN` },

  //         data: formData,

  //         onUploadProgress: (event) => {

  //           const { loaded, total } = event;

  //           let per = Math.floor((loaded * 100) / total);

  //           console.log(`Process ${per}%`);

  //           animateProgress(per);

  //         },

  //       });

  //       if (response.status == 201) {

  //         console.log("UPLOAD SUCESSFUL");

  //         // Create new asset in Strapi

  //         const uidResponse = response.data.uid;

  //         const name = file.name;

  //         var data = {

  //           data: {

  //             assetUID: uidResponse,

  //             description: name,

  //             productId: productId,

  //             isPublished: true,

  //             thumbnail: "null",

  //           },

  //         };

 

  //         const modelInfo = await http.post("assets", data, {

  //           headers: {

  //             Authorization: `Bearer ${getJWTToken}`,

  //           },

  //         });

  //         console.log("modelInfo", modelInfo);

  //         setUid(uidResponse);

  //         setStatusUpload(false);

  //       }

  //     } catch (error) {

  //       console.error("Error occurred:", error);

  //     }

  //   };

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

  const handleFilesChange = (e) => {

    const file = e.target.files[0]; // Lấy tệp đầu tiên trong danh sách đã chọn

    // Kiểm tra phần mở rộng của tệp (extension)

    if (file) {

      const allowedExtensions = [".obj", ".blend", ".fbx", ".gltf", ".glb"]; // Các phần mở rộng cho tệp ảnh

      const fileExtension = file.name.substring(file.name.lastIndexOf("."));

 

      if (allowedExtensions.includes(fileExtension.toLowerCase())) {

        // Nếu phần mở rộng hợp lệ, lưu tệp vào state

        setSelectedFiles(file);

        console.log("Selected File:", file);

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

      productDescription,

      getIDBusiness,

      selectedFile,

      selectedFiles,

    };

 

    if (form.checkValidity() === false) {

      event.preventDefault();

      event.stopPropagation();

    }

    setValidated(true);

    if (

      productName !== "" &&

      productId !== "" &&

      productDescription !== "" &&

      selectedFile !== null &&

      selectedFiles !== null &&

      getIDBusiness

    ) {

      setIsButtonDisabled(true);
      setIsButtonAddDisabled(true)
      setIsProcessing(true);

      const dataImg = new FormData();

      //   dataImg.append("refId", "2"); // Thay thế bằng ID của folder trong Media Library

      //   dataImg.append("ref", "Virtual Try-out");

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

          http

            .post(

              "/products",

              {

                data: {

                  title: formData.productName,

                  description: formData.productDescription,

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

            )

        });

 

      axios("https://api.sketchfab.com/v3/models", {

        method: "POST",

        headers: { Authorization: `Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN` },

        data: formDataSketchfab,

        // onUploadProgress: (event) => {

        //   const { loaded, total } = event;

        //   let per = Math.floor((loaded * 100) / total);

        //   console.log(`Process ${per}%`);

        //   animateProgress(per);

        // },

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

    // if (

    //   productName !== "" &&

    //   productId !== "" &&

    //   brand !== "" &&

    //   stock !== "" &&

    //   productDescription !== "" &&

    //   selectedFile !== null &&

    //   getIDBusiness

    // ) {

    //   http

    //     .post(

    //       "/product",

    //       {

    //         data: {

    //           title: formData.productName,

    //           description: formData.productDescription,

    //           stock: formData.stock,

    //           brand: formData.brand,

    //           productId: formData.productId,

    //           businessId: formData.getIDBusiness,

    //         },

    //       },

    //       {

    //         headers: {

    //           Authorization: `Bearer ${getJWTToken}`,

    //         },

    //       }

    //     )

    //     .then((res) => {

    //       handleModalInitClose();

    //     });

    // }

  };

  const handleModalInitClose = () => {

    handleModalAddProductClose();

    setProductName("");

    setProductId("");

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

        {/* <h3 style={{ fontSize: "20px" }}>

          <b>Product Thumbnail</b>

        </h3>

        <br />

        <input type="file"></input> */}

        {/* <h3 style={{ fontSize: "20px", margin: "15px 0" }}>

          <b>3D model</b>

        </h3>

        <p>Upload 3D models of your product here.</p>

        <div>

          <Form.Group className="position-relative mb-3">

            <Form.Label>

              <b>Choose Files</b>

            </Form.Label>

            <Form.Control type="file" multiple onChange={handleFilesChange} />

          </Form.Group>

 

          <Button onClick={handleUpload}>Upload</Button>

 

          {selectedFiles.length > 0 && (

            <ListGroup className="mt-3">

              {selectedFiles.map((file, index) => (

                <ListGroup.Item key={index}>{file.name}</ListGroup.Item>

              ))}

            </ListGroup>

          )}

        </div> */}

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

      {/* <Modal

        backdrop="static"

        centered="true"

        show={show}

        onShow={() => {}}

        onHide={handleClose}

      >

        <Modal.Header>

          <Modal.Title>Upload Asset</Modal.Title>

        </Modal.Header>

 

        <Modal.Body>

          <Form enctype="multipart/form-data">

            <InputGroup className="mb-3">

              <Form.Control

                id="file"

                type="file"

                accept=".obj*, .blend, .fbx, .gltf, .glb"

                onChange={handleFileChange}

              />

 

              <Button disabled={!selectFile} onClick={handleSubmit}>

                Upload

              </Button>

            </InputGroup>

 

            <ProgressBar

              animated={percentage < 100}

              now={percentage}

              label={percentage < 100 ? `${percentage}%` : "Successful"}

            />

          </Form>

        </Modal.Body>

 

        <Modal.Footer>

          <Button variant="light" disabled={onUploading} onClick={handleClose}>

            {" "}

            Close{" "}

          </Button>

        </Modal.Footer>

      </Modal> */}

    </Modal>

  );

};

export default CreateProduct;