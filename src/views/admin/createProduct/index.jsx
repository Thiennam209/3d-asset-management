import { Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import {
  Form,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";

import axios from "axios";

import { http, urlStrapi } from "../../../axios/init";

import QRCode from 'qrcode';

const CreateProduct = ({
  showModalAddProduct,

  handleModalAddProductClose,

  getJWTToken,

  getIDBusiness,

  onSubmitSuccess,

  setIsButtonAddDisabled,
}) => {
  const [productName, setProductName] = useState("");
  const [nameAsset, setNameAsset] = useState("");

  const [category, setCategory] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const [productId, setProductId] = useState("");
  const [tryoutLink, setTryoutLink] = useState("");

  const [productDescription, setProductDescription] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [limitedSizeThumb, setLimitedSizeThumb] = useState(false);
  const MAX_FILE_SIZE_THUMB = 300 * 1024; // KB

  const [selectedFiles, setSelectedFiles] = useState(null);
  const [limitedSize, setLimitedSize] = useState(false);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // MB

  const [validated, setValidated] = useState(false);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [alertMessageAdd, setAlertMessageAdd] = useState(false);

  const [selectOption, setSelectOption] = useState("basic");

  useEffect(() => {
    http.get(`categories`,
      {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      }
    ).then((res) => {
      setCategory(res.data.data)
    })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên trong danh sách đã chọn

    if (file && file.size > MAX_FILE_SIZE_THUMB) {
      // TODO
      setLimitedSizeThumb(true);
      setSelectedFile(null);
    } else {
      setLimitedSizeThumb(false);

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
    }

    // Kiểm tra phần mở rộng của tệp (extension)
  };

  const handleFilesChange = (e) => {
    const file = e.target.files[0]; // Lấy tệp đầu tiên trong danh sách đã chọn

    if (file && file.size > MAX_FILE_SIZE) {
      // TODO
      setLimitedSize(true);
      setSelectedFiles(null);
    } else {
      setLimitedSize(false);

      // Kiểm tra phần mở rộng của tệp (extension)

      if (file) {
        const allowedExtensions = [".obj", ".blend", ".fbx", ".gltf", ".glb", ".zip"]; // Các phần mở rộng cho tệp ảnh

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
    }
  };

  const handleFinnish = (event) => {
    setIsProcessing(true);
    setIsButtonDisabled(true);
    setIsButtonAddDisabled(true);
    const form = event.currentTarget;
    const formData = {
      productName,
      productId,
      tryoutLink,
      category,
      productDescription,
      getIDBusiness,
      selectedFile,
      selectedFiles,
      nameAsset
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
      nameAsset !== "" &&
      getIDBusiness
    ) {
      const dataImg = new FormData();
      dataImg.append("files", selectedFile);
      const formDataSketchfab = new FormData();
      formDataSketchfab.append("modelFile", selectedFiles);
      formDataSketchfab.append("isInspectable", true);
      formDataSketchfab.append("license", "by");
      // Gửi yêu cầu POST để tải ảnh lên Strapi (thay thế URL bằng URL thực tế của Strapi)
      http
        .get(`/businesses?filters[businessId][$eq]=${getIDBusiness}`, {
          headers: {
            Authorization: `Bearer ${getJWTToken}`,
          },
        })
        .then((res) => {
          const tokenSket = res.data.data[0].attributes.sketchfabCredentialCode
          http
            .get(`/products?filters[productId][$eq]=${productId}&populate=*`, {
              headers: {
                Authorization: `Bearer ${getJWTToken}`,
              },
            })
            .then((res) => {
              const duplicateId = res.data.data.length;
              if (duplicateId > 0) {
                // setAlertMessageEdit(true);
                setProductId("");
                setValidated(true);
                setAlertMessageAdd(true);
                setIsProcessing(false);
                setIsButtonDisabled(false);
                setIsButtonAddDisabled(false);
                // return;
              } else {
                http
                  .post("/upload", dataImg, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${getJWTToken}`,
                    },
                  })
                  .then((res) => {
                    const urlImg = `${urlStrapi}${res.data[0].url}`;
                    const imgId = res.data[0].id;
                    axios("https://api.sketchfab.com/v3/models", {
                      method: "POST",
                      headers: {
                        Authorization: "Bearer " + tokenSket,
                      },
                      data: formDataSketchfab,
                    }).then((res) => {
                      if (res.status === 201) {
                        const uidResponse = res.data.uid;

                        const qrCodeOptions = {
                          errorCorrectionLevel: 'H',
                          type: 'image/png',
                          rendererOpts: {
                            quality: 1.0,
                          },
                          scale: 20,
                        };
                        QRCode.toDataURL(uidResponse, qrCodeOptions)
                          .then((url) => {
                            // save code
                            const arrayBuffer = Uint8Array.from(atob(url.split(',')[1]), c => c.charCodeAt(0)).buffer;
                            const formDataQR = new FormData();
                            const fileName = "QRCode_" + uidResponse + ".png"
                            formDataQR.append('files', new File([arrayBuffer], fileName, { type: 'image/png' }));
                            // const fileQR = base64toFile(base64Data, fileName)
                            // formData.append('files', fileQR);
                            http
                              .post("/upload", formDataQR, {
                                headers: {
                                  "Content-Type": "multipart/form-data",
                                  Authorization: `Bearer ${getJWTToken}`,
                                },
                              })
                              .then((res) => {
                                const urlImgQR = `${urlStrapi}${res.data[0].url}`;
                                var data = {
                                  data: {
                                    assetUID: uidResponse,
                                    description: formData.productName,
                                    productId: formData.productId,
                                    qrcode: urlImgQR,
                                    productId: formData.tryoutLink,
                                    isPublished: false,
                                    thumbnail: "null",
                                    name: formData.nameAsset
                                  },
                                };
                                http
                                  .post("assets", data, {
                                    headers: {
                                      Authorization: `Bearer ${getJWTToken}`,
                                    },
                                  })
                                  .then((res) => {
                                    const idAsset = res.data.data.id;
                                    http.post(
                                      "/products",

                                      {
                                        data: {
                                          title: formData.productName,
                                          assets: idAsset,
                                          description: formData.productDescription,

                                          productId: formData.productId,
                                          tryoutLink: formData.tryoutLink,
                                          businessId: formData.getIDBusiness,
                                          arViewer: selectOption,
                                          category: formData.category,
                                          thumbnail: urlImg,
                                          testImage: imgId,
                                        },
                                      },

                                      {
                                        headers: {
                                          Authorization: `Bearer ${getJWTToken}`,
                                        },
                                      }
                                    ).then((res) => {
                                      onSubmitSuccess(
                                        `Create new product with name ${formData.productName} was successful.`
                                      );
                                      handleModalInitClose();
                                      setIsButtonDisabled(false);
                                      setIsProcessing(false);
                                    }).catch((er) => {
                                      onSubmitSuccess("Fail");
                                      handleModalInitClose();
                                      setIsButtonDisabled(false);
                                      setIsProcessing(false);
                                    })
                                  });

                              })
                              .catch((err) => {
                              })
                          })
                          .catch((err) => {
                            console.error(err);
                          })




                      }
                      else {
                        onSubmitSuccess("Fail");
                        handleModalInitClose();
                        setIsButtonDisabled(false);
                        setIsProcessing(false);
                      }
                    }).catch((err) => {
                      onSubmitSuccess("Fail");
                      handleModalInitClose();
                      setIsButtonDisabled(false);
                      setIsProcessing(false);
                    });
                  });
              }
            });
        })
        .catch((er) => {
          onSubmitSuccess("Fail");
          handleModalInitClose();
          setIsButtonDisabled(false);
          setIsProcessing(false);
        })


    } else {
      setIsButtonDisabled(false);
      setIsProcessing(false);
      setIsButtonAddDisabled(false);
    }
  };

  const handleModalInitClose = () => {
    handleModalAddProductClose();

    setProductName("");
    setNameAsset("")
    setProductId("");
    setTryoutLink("");
    setSelectOption("basic");

    setProductDescription("");

    setValidated(false);
    setLimitedSize(false);
    setLimitedSizeThumb(false);

    setCategoryName("");
  };

  const handleChangeRadio = (e) => {
    setSelectOption(e.target.value);
  }
  if (alertMessageAdd) {
    setTimeout(() => {
      setAlertMessageAdd(false);
    }, 3000);
  }
  return (
    <Modal
      show={showModalAddProduct}
      onHide={()=>{
        handleModalInitClose()
      }}
      size="lg"
    >
      <Modal.Header style={{ padding: "20px 20px 10px 50px" }}>
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
            controlId="validationProductId"
            style={{
              margin: "5px 0",

              display: "flex",

              flexDirection: "column",

              justifyContent: "space-between",
            }}
          >
            <Form.Label>Product id</Form.Label>

            <Form.Control
              style={{ width: "513px" }}
              type="text"
              maxLength={20}
              placeholder="Enter product id"
              value={productId}
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9]*$/.test(value)) {
                  setProductId(value);
                } else if (value === '') {
                  setProductId('');
                }
              }}

              onKeyDown={(e) => {
                if (e.isComposing) {
                  e.preventDefault();
                }
              }}

              onCompositionUpdate={(e) => {
                e.preventDefault();
              }}

              autocorrect="off"
              required
            />
            {alertMessageAdd ? (
              <div style={{ fontSize: "80%", color: "#dc3545" }}>
                <BsFillExclamationCircleFill
                  style={{ display: "inline", margin: "5px 10px" }}
                />
                <b>Duplication id</b>! Please choose diferrent product id.
              </div>
            ) : (
              <Form.Control.Feedback type="invalid">
                Please enter product id
              </Form.Control.Feedback>
            )}
          </Form.Group>
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
              maxLength={50}
            />

            <Form.Control.Feedback type="invalid">
              Please enter product name
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            style={{
              margin: "5px 0",

              display: "flex",

              flexDirection: "column",

              justifyContent: "space-between",
            }}
          >
            <Form.Label>Tryout link</Form.Label>

            <Form.Control
              style={{ width: "513px" }}
              type="text"
              placeholder="Enter tryout link"
              value={tryoutLink}
              onChange={(e) => setTryoutLink(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            controlId="validationProductName"
            style={{
              margin: "5px 0",

              display: "flex",

              flexDirection: "column",

              justifyContent: "space-between",
            }}
          >
            <Form.Label>Category</Form.Label>

            <Form.Control
              style={{ width: "513px" }}
              as="select"
              placeholder="Enter product name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            >
              <option value="" disabled>Select a category</option>
              {category.map((item) => (
                <option value = {item?.id} >{item?.attributes?.name}</option>
              ))}
            </Form.Control>

            <Form.Control.Feedback type="invalid">
              Please select a category
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Ar Viewer</Form.Label>
            <div key="inline-radio" className="mb-2">
              <Form.Check
                inline
                label="Basic"
                value="basic"
                name="group1"
                type="radio"
                id="inline-radio-1"
                checked={selectOption === "basic"}
                onChange={handleChangeRadio}
              />
              <Form.Check
                inline
                label="Advanced"
                value="advanced"
                name="group1"
                type="radio"
                id="inline-radio-2"
                checked={selectOption === "advanced"}
                onChange={handleChangeRadio}
              />
            </div>
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
              as={Textarea}
              rows={5}
              maxLength={500}
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
              isInvalid={limitedSizeThumb}
              style={{ width: "513px" }}
            />

            <Form.Control.Feedback type="invalid">
              {!limitedSizeThumb ? (
                <>
                  Please choose the correct image with format :{" "}
                  <b>&ensp;. jpg &ensp;. jpeg &ensp;. png &ensp;. gif</b>
                </>
              ) : (
                <>
                  This file is too big to load. Please limit the file to &lt;
                  300kB
                </>
              )}
            </Form.Control.Feedback>
          </Form.Group>

          <br />
          <Form.Label>
            <b style={{ fontSize: "22px" }}>3D model</b>

            <p>Upload 3D models of your product here.</p>
          </Form.Label>
          <Form.Group className="position-relative mb-3">
            <Form.Label>Asset name</Form.Label>
            <Form.Control
              style={{ width: "513px" }}
              type="text"
              placeholder="Enter name asset"
              value={nameAsset}
              onChange={(e) => setNameAsset(e.target.value)}
              required
              maxLength={20}
            />

            <Form.Control.Feedback type="invalid">
              Please enter name model
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="position-relative mb-3">
            <Form.Label>3D Model</Form.Label>
            <Form.Control
              style={{ width: "513px" }}
              type="file"
              onChange={handleFilesChange}
              accept=".obj*, .blend, .fbx, .gltf, .glb, .zip"
              isInvalid={limitedSize}
              required
            />

            <Form.Control.Feedback type="invalid">
              {!limitedSize ? (
                <>
                  Please choose the correct image with format :{" "}
                  <b>
                    &ensp;. obj* &ensp;. blend &ensp;. fbx &ensp;. gltf &ensp;.
                    glb
                  </b>
                </>
              ) : (
                <>
                  This file is too big to load. Please limit the file to &lt;
                  50MB
                </>
              )}
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
