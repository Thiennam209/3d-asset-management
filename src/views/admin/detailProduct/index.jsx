import ReactDOM from "react-dom";
import { Box, Icon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { http, urlStrapi } from "../../../axios/init";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import { useLocation } from "react-router-dom";
import Sketchfab from "@sketchfab/viewer-api";
import { MdOutlineEdit, MdAdd } from "react-icons/md";
import "./styleDetail.css";
import { Form, Alert } from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import { FaEdit } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { BsQrCodeScan } from "react-icons/bs";
import axios from "axios";
import ModalEditProduct from "./component/modalEditProduct";
import DeleteModel from "./component/deleteModel";
import { TiDelete } from "react-icons/ti";
import QRCode from "qrcode";
import DetailPart from "./component/detailPart";
import { ModalUpdateAsset } from "./component/ModalUpdateAsset";

const DetailProduct = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const businessId = searchParams.get("id");
  const _productId = searchParams.get("productID");

  const [data, setData] = useState([]);
  const [listAsset, setListAsset] = useState([]);
  const getJWTToken = localStorage.getItem("dtvt");
  const [uID, setUID] = useState("");
  const [lgShow, setLgShow] = useState(false);
  const [show, setShow] = useState(false);
  const [selectFile, enableUploadButton] = useState(false);
  const [file, setFile] = useState(null);
  const [limitedSize, setLimitedSize] = useState(false);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // MB
  const [percentage, animateProgress] = useState(0);
  const [onUploading, setStatusUpload] = useState(false);
  const [uid, setUid] = useState("");
  const [modelQuantity, setModelQuatity] = useState("");
  const [arrayAssetId, setArrayAssetId] = useState([]);
  const [updateAsset, setUpdateAsset] = useState(false);
  const [successMessageEdit, setSuccessMessageEdit] = useState("");
  const [successMessageDelete, setSuccessMessageDelete] = useState("");
  const [successMessageUpload, setSuccessMessageUpload] = useState("");
  const [dataAsset, setDataAsset] = useState([]);
  const [showModalEditProduct, setShowModalEditProduct] = useState(false);
  const [showModalDeleteModel, setShowModalDeleteModel] = useState(false);
  const [showModalUpdateAsset, setShowModalUpdateAsset] = useState(false);
  const [dataEdit, setDataEdit] = useState([]);
  const [dataDelete, setDataDelete] = useState([]);
  const [productId, setProductId] = useState(_productId);
  const [validated, setValidated] = useState(false);
  const [nameAsset, setNameAsset] = useState("");
  const [errors, setErrors] = useState({});
  const [hasNavigated, setHasNavigated] = useState(false);
  const [tokenSket, setTokenSket] = useState("");
  const [imgQRCode, setImgQRCode] = useState("");

  const [qrShow, setQRShow] = useState(false);

  const handleModalEditProductClose = () => setShowModalEditProduct(false);
  const handleModalEditProductShow = (data) => {
    setShowModalEditProduct(true);
    setDataEdit(data);
  };
  const handleModalDeleteModelClose = () => setShowModalDeleteModel(false);
  const handleModalDeleteModelShow = (data) => {
    setShowModalDeleteModel(true);
    setDataDelete(data);
  };
  const handleModalUpdateAssetClose = () => setShowModalUpdateAsset(false);
  const handleModalUpdateAsset = (data) => {
    setDataAsset(data);
    setShowModalUpdateAsset(true);
  };
  const handleClose = () => {
    setShow(false);
    setNameAsset("");
    setFile(null);
    enableUploadButton(false);
    setLimitedSize(false);
    animateProgress(0);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.size > MAX_FILE_SIZE) {
      setLimitedSize(true);
      enableUploadButton(false);
      setFile(null);
      document.getElementById("file").value = "";
      return;
    }

    setLimitedSize(false);
    setFile(file);

    enableUploadButton(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!nameAsset) {
      errors.nameAsset = "Please enter name model.";
    }

    if (!file) {
      errors.file = "Please choose file model.";
    } else if (limitedSize) {
      errors.file =
        "This file is too big to load. Please limit the file to &lt; 50MB";
    }

    return errors;
  };

  const createQRCode = (uId) => {
    QRCode.toDataURL("https://www.google.com/")
      .then((url) => {
        saveQRCode(url, uId);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const saveQRCode = (base64Data, uId) => {
    const arrayBuffer = Uint8Array.from(atob(base64Data.split(",")[1]), (c) =>
      c.charCodeAt(0)
    ).buffer;
    const formData = new FormData();
    const fileName = "QRCode_" + uId + ".png";
    formData.append(
      "files",
      new File([arrayBuffer], fileName, { type: "image/png" })
    );
    http
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        const urlImg = `${urlStrapi}${res.data[0].url}`;
      })
      .catch((err) => {});
  };

  const handleSubmit = async (event) => {
    const errors = validateForm();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (Object.keys(errors).length === 0) {
      setStatusUpload(true);

      enableUploadButton(false);

      const formData = new FormData();

      formData.append("modelFile", file);

      formData.append("isInspectable", true);

      formData.append("license", "by");

      try {
        const response = await axios("https://api.sketchfab.com/v3/models", {
          method: "POST",

          headers: { Authorization: "Bearer " + tokenSket },

          data: formData,

          onUploadProgress: (event) => {
            const { loaded, total } = event;

            let per = Math.floor((loaded * 100) / total);

            animateProgress(per);
          },
        });

        if (response.status === 201) {
          const uidResponse = response.data.uid;

          const name = file.name;
          const qrCodeOptions = {
            errorCorrectionLevel: "H",
            type: "image/png",
            rendererOpts: {
              quality: 1.0,
            },
            scale: 20,
          };
          QRCode.toDataURL(uidResponse, qrCodeOptions)
            .then((url) => {
              // save code
              const arrayBuffer = Uint8Array.from(
                atob(url.split(",")[1]),
                (c) => c.charCodeAt(0)
              ).buffer;
              const formData = new FormData();
              const fileName = "QRCode_" + uidResponse + ".png";
              formData.append(
                "files",
                new File([arrayBuffer], fileName, { type: "image/png" })
              );
              http
                .post("/upload", formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${getJWTToken}`,
                  },
                })
                .then((res) => {
                  const urlImg = `${urlStrapi}${res.data[0].url}`;
                  var dataRes = {
                    data: {
                      assetUID: uidResponse,
                      description: name,
                      qrcode: urlImg,
                      productId: productId,
                      name: nameAsset,
                      isPublished: false,
                      thumbnail: "null",
                    },
                  };

                  http
                    .post("assets", dataRes, {
                      headers: {
                        Authorization: `Bearer ${getJWTToken}`,
                      },
                    })
                    .then((res) => {
                      const idProduct = data[0].id;
                      const idAsset = res.data.data.id;
                      arrayAssetId.push(idAsset);
                      var dataRequest = {
                        data: {
                          assets: arrayAssetId,
                        },
                      };
                      http
                        .put(`/products/${idProduct}`, dataRequest, {
                          headers: {
                            Authorization: `Bearer ${getJWTToken}`,
                          },
                        })
                        .then((response) => {
                          setUid(uidResponse);
                          setStatusUpload(false);
                          handleClose();
                        })
                        .catch((err) => {
                          const errs = {};
                          errs.strapi = "Uploading 3D model failed";
                          setErrors(err);
                          setNameAsset("");
                          setFile(null);
                          document.getElementById("file").value = "";
                          animateProgress(0);
                        });
                    });
                })
                .catch((err) => {});
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          const err = {};
          err.strapi = "Uploading 3D model failed";
          setNameAsset("");
          setFile(null);
          document.getElementById("file").value = "";
          setErrors(err);
          animateProgress(0);
        }
      } catch (error) {
        console.error("Error occurred:", error);
        const err = {};
        err.strapi = "Uploading 3D model failed";
        setErrors(err);
        setNameAsset("");
        setFile(null);
        animateProgress(0);
        document.getElementById("file").value = "";
      }
    } else {
      setErrors(errors);
    }
  };

  const autoPlayAll3DViewers = () => {
    var selectors = document.querySelectorAll("#api-frame");

    Array.from(selectors).forEach((element) => {
      var client = new Sketchfab(element);

      var uid = element.getAttribute("data-uid");

      client.init(uid, {
        success: function onSuccess(api) {
          api.start();

          api.addEventListener("viewerready", function () {
            // API is ready to use
            // Insert your code here
          });
        },

        error: function onError() {},
      });
    });
  };

  const handleModalSubmitSuccessEdit = (message) => {
    setSuccessMessageEdit(message);
  };
  const handleModalSubmitSuccessDelete = (message) => {
    setSuccessMessageDelete(message);
  };
  const handleNewProductId = (newProductId) => {
    setProductId(newProductId);
  };

  const deleteModelFailed = (id, assetUID) => {
    setStatusUpload(true);
    http
      .delete(`assets/${id}`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        axios(`https://api.sketchfab.com/v3/models/${assetUID}`, {
          method: "DELETE",

          headers: {
            Authorization: "Bearer " + tokenSket,
          },
        })
          .then((response) => {})
          .catch((err) => {});

        setStatusUpload(false);
        setSuccessMessageUpload(`Upload a 3D model was successful.`);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (!hasNavigated) {
      // Chỉ chạy scrollTo(0, 0) khi chuyển trang lần đầu
      window.scrollTo(0, 0);
      // Đánh dấu là đã chuyển trang lần đầu
      setHasNavigated(true);
    }
    const searchParams = new URLSearchParams(location.search);

    http
      .get(`/businesses?filters[businessId][$eq]=${businessId}`, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })
      .then((res) => {
        setTokenSket(res.data.data[0].attributes.sketchfabCredentialCode);
      });

    http
      .get(
        `products?filters[businessId][$eq]=${businessId}&filters[productId][$eq]=${productId}&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${getJWTToken}`,
          },
        }
      )

      .then((response) => {
        const objectData = response.data.data;

        const objectsData = [...objectData];

        const dataDetailProduct = objectsData[0];
        getAssetsID(dataDetailProduct);
        setData([dataDetailProduct]);

        setModelQuatity(response.data.data[0].attributes.assets.data.length);
        if (objectsData.length !== 0) {
          const objectsDataListAssest =
            dataDetailProduct.attributes.assets.data;
          setListAsset(objectsDataListAssest);
          objectsDataListAssest.forEach((item, index) => {
            updateStatusIsPublish(item.id, item.attributes.isPublished);

            if (item.attributes.thumbnail === "null") {
              const timestamp = new Date().getTime();
              axios(
                `https://api.sketchfab.com/v3/models/${item.attributes.assetUID}?timestamp=${timestamp}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: "Bearer " + tokenSket,
                  },
                }
              )
                .then((repo) => {
                  const assetId = item.id;

                  const imageURL = repo.data.thumbnails.images[2].url;

                  if (repo.data.status.processing === "SUCCEEDED") {
                    var dataRequest = {
                      data: {
                        thumbnail: imageURL,
                      },
                    };

                    http
                      .put(`/assets/${assetId}`, dataRequest, {
                        headers: {
                          Authorization: `Bearer ${getJWTToken}`,
                        },
                      })

                      .then((responseAsset) => {
                        setUpdateAsset(true);
                      })

                      .catch((err) => err);
                  }

                  if (repo.data.status.processing === "FAILED") {
                    deleteModelFailed(item.id, item.attributes.assetUID);
                  }
                })
                .catch((err) => err);
            } else {
              axios(
                `https://api.sketchfab.com/v3/models/${item.attributes.assetUID}`,
                {
                  method: "GET",

                  headers: {
                    Authorization: "Bearer " + tokenSket,
                  },
                }
              )
                .then((repo) => {
                  const assetId = item.id;

                  const imageURL = repo.data.thumbnails.images[2].url;

                  if (item.attributes.thumbnail !== imageURL) {
                    var dataRequest = {
                      data: {
                        thumbnail: imageURL,

                        status: "true",
                      },
                    };

                    http
                      .put(`/assets/${assetId}`, dataRequest, {
                        headers: {
                          Authorization: `Bearer ${getJWTToken}`,
                        },
                      })

                      .then((responseAsset) => {
                        setUpdateAsset(true);
                      })

                      .catch((err) => err);
                  }
                })
                .catch((err) => err);
            }
            setListAsset(objectsDataListAssest);
          });
        }
      })

      .catch((err) => err);

    autoPlayAll3DViewers();
  }, [
    onUploading,
    updateAsset,
    successMessageEdit,
    successMessageDelete,
    showModalUpdateAsset === false,
  ]);

  const checkImageDefault = (value) => {
    if (value.includes("https://media.sketchfab.com/models")) {
      return true;
    } else return false;
  };

  const getAssetsID = (item) => {
    let arrayId = [];
    item.attributes.assets.data.forEach((value, index) => {
      arrayId.push(value.id);
    });

    setArrayAssetId(arrayId);
  };
  const onShow = () => {
    var selector = document.getElementById("api-frame-detail");

    var client = new Sketchfab(selector);

    var uid = selector.getAttribute("data-uid");

    client.init(uid, {
      success: function onSuccess(api) {
        api.start();

        api.addEventListener("viewerready", function () {
          // API is ready to use
          // Insert your code here
        });
      },

      error: function onError() {},
    });
  };

  const onClickDetailAsset = (value) => {
    setLgShow(true);

    setUID(value);
  };
  if (successMessageEdit) {
    setTimeout(() => {
      setSuccessMessageEdit(null);
    }, 3000);
  }
  if (successMessageUpload) {
    setTimeout(() => {
      setSuccessMessageUpload(null);
    }, 3000);
  }
  if (successMessageDelete) {
    setTimeout(() => {
      setSuccessMessageDelete(null);
    }, 3000);
  }

  const [isLoadingMap, setIsLoadingMap] = useState({});
  const [isStatusPublish, setIsStatusPublish] = useState({});

  const updateStatusIsPublish = (itemId, isPublish) => {
    setIsStatusPublish((prevMap) => ({
      ...prevMap,
      [itemId]: isPublish,
    }));
  };

  // Hàm để cập nhật trạng thái isLoading cho một mục cụ thể
  const updateLoadingState = (itemId, isLoading) => {
    setIsLoadingMap((prevMap) => ({
      ...prevMap,
      [itemId]: isLoading,
    }));
  };

  const changeStatus = async (id, sta) => {
    updateLoadingState(id, true);
    var dataRequest = {
      data: {
        isPublished: sta,
      },
    };

    http
      .put(`/assets/${id}`, dataRequest, {
        headers: {
          Authorization: `Bearer ${getJWTToken}`,
        },
      })

      .then((responseAsset) => {
        updateLoadingState(id, false);
        updateStatusIsPublish(id, sta);
      })

      .catch((err) => err);
  };

  const ShowQRCode = (url) => {
    setImgQRCode(url);
    if (url) setQRShow(true);
  };

  if (
    businessId !== null &&
    businessId !== "" &&
    productId !== null &&
    productId !== ""
  ) {
    return (
      <>
        {successMessageEdit && (
          <Alert
            variant="success"
            style={{
              zIndex: "1",
              position: "fixed",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <BsFillCheckCircleFill
              style={{ display: "inline", margin: "5px 10px" }}
            />{" "}
            {successMessageEdit}
          </Alert>
        )}
        {successMessageDelete === "Fail" && (
          <Alert
            variant="danger"
            style={{
              zIndex: "1",
              position: "fixed",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <BsFillCheckCircleFill
              style={{ display: "inline", margin: "5px 10px" }}
            />{" "}
            Delete a 3D model Failed
          </Alert>
        )}

        {successMessageUpload && (
          <Alert
            variant="danger"
            style={{
              zIndex: "1",
              position: "fixed",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <BsFillCheckCircleFill
              style={{ display: "inline", margin: "5px 10px" }}
            />{" "}
            Upload a 3D model Failed
          </Alert>
        )}

        {successMessageDelete && successMessageDelete !== "Fail" && (
          <Alert
            variant="success"
            style={{
              zIndex: "1",
              position: "fixed",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <BsFillCheckCircleFill
              style={{ display: "inline", margin: "5px 10px" }}
            />{" "}
            {successMessageDelete}
          </Alert>
        )}

        <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
          {data.map((item, index) => (
            <Card
              key={index}
              style={{ margin: "30px 10px", borderRadius: "16px" }}
            >
              <Card.Body>
                <Row>
                  <Col xs={4} style={{ padding: "30px 0" }}>
                    <div className="d-flex justify-content-center align-items-center">
                      <Card.Img
                        variant="left"
                        src={
                          urlStrapi +
                          "/" +
                          item?.attributes?.testImage?.data?.attributes?.url
                        }
                        style={{
                          width: "360px",
                          maxHeight: "360px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </Col>

                  <Col xs={8} style={{ padding: "30px 32px 30px 70px" }}>
                    <Card.Title
                      style={{
                        marginBottom: "10px",
                        fontSize: "40px",
                        fontWeight: "bold",
                      }}
                    >
                      {item?.attributes?.title}
                    </Card.Title>

                    <Card.Text
                      style={{ margin: "16px 0px 8px 0px", color: "#6C757D" }}
                    >
                      Product ID: {item?.attributes?.productId}
                    </Card.Text>

                    <Card.Text
                      style={{ marginBottom: "8px", color: "#6C757D" }}
                    >
                      Models Quantity: {modelQuantity}
                    </Card.Text>

                    {item?.attributes?.category?.data && (
                      <Card.Text
                        style={{ margin: "16px 0px 8px 0px", color: "#6C757D" }}
                      >
                        Category:{" "}
                        {item?.attributes?.category?.data?.attributes?.name}
                      </Card.Text>
                    )}

                    <Card.Text
                      style={{ margin: "16px 0px 8px 0px", color: "#6C757D" }}
                    >
                      Tryout Link:{" "}
                      {item?.attributes?.tryoutLink !== "" &&
                      item?.attributes?.tryoutLink ? (
                        <a
                          target="_blank"
                          href={`${item?.attributes?.tryoutLink}`}
                        >
                          {item?.attributes?.tryoutLink}
                        </a>
                      ) : (
                        "Not Available"
                      )}
                    </Card.Text>
                    <Card.Text
                      style={{
                        margin: "16px 0px 16px 0px",
                        color: "#212529",
                        fontSize: "20px",
                        textAlign: "left",
                      }}
                    >
                      {item?.attributes?.description}
                    </Card.Text>

                    <div key="inline-radio" className="mb-3">
                      <Form.Check
                        inline
                        label="Basic"
                        value="basic"
                        name="group1"
                        type="radio"
                        id="inline-radio-1"
                        checked={item?.attributes?.arViewer === "basic"}
                        disabled={item?.attributes?.arViewer === "advanced"}
                      />
                      <Form.Check
                        inline
                        label="Advanced"
                        value="advanced"
                        name="group1"
                        type="radio"
                        id="inline-radio-2"
                        checked={item?.attributes?.arViewer === "advanced"}
                        disabled={item?.attributes?.arViewer === "basic"}
                      />
                    </div>

                    <div
                      className="position-absolute bottom-0 end-0 text-muted"
                      style={{ margin: "0px 50px 50px 0 ", cursor: "pointer" }}
                    >
                      <Icon
                        as={MdOutlineEdit}
                        style={{
                          padding: "0px 0px 5px",
                          width: "25px",
                          height: "25px",
                          color: "#0D6EFD",
                        }}
                      ></Icon>
                      <u
                        style={{
                          color: "#0D6EFD",
                          marginLeft: "6px",
                          fontSize: "18px",
                        }}
                        onClick={() => handleModalEditProductShow(item)}
                      >
                        Edit
                      </u>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <Card.Title
            style={{
              margin: "69px 0px 38px 10px ",
              fontSize: "35px",
              fontWeight: "bold",
              color: "#212529",
            }}
          >
            3D Models
          </Card.Title>

          <Card style={{ margin: "30px 10px" }}>
            <Card.Body>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  columnGap: "50px",
                  padding: "32px",
                }}
              >
                {listAsset
                  .filter(
                    (value) =>
                      value.attributes.thumbnail !== "null" &&
                      checkImageDefault(value.attributes.thumbnail)
                  )
                  .map((item, index) => (
                    <div
                      onClick={() =>
                        onClickDetailAsset(item.attributes.assetUID)
                      }
                      style={{
                        width: "100%",
                        padding: "100% 0px 0px 0px",
                        position: "relative",
                        margin: "10px 0px",
                        boxSizing: "border-box",
                      }}
                    >
                      <Card.Img
                        variant="left"
                        src={item?.attributes?.thumbnail}
                        style={{
                          width: "100%",
                          height: "90%",
                          borderRadius: "8px",
                          position: "absolute",
                          top: "0",
                          left: "0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          objectFit: "cover",
                          border: "1px solid var(--gray-300, #DEE2E6)",
                          background: "var(--gray-100, #F8F9FA)",
                          boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                      <div className="titleItems">
                        <div className="btnDelete">
                          <FaEdit
                            className="iconDelete"
                            style={{ scale: "0.8", marginRight: "0" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModalUpdateAsset(item);
                            }}
                          />
                          <TiDelete
                            className="iconDelete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModalDeleteModelShow(item);
                            }}
                          />
                        </div>

                        <div className="groupTitle">
                          <div className="bodyTitle">
                            <p>{data[0].attributes.title}</p>

                            <p className="idModel">
                              <b>Model:</b> {item?.attributes?.name}
                            </p>
                          </div>
                        </div>

                        <div></div>
                      </div>

                      <div
                        className="tagQRCode"
                        onClick={(e) => {
                          e.stopPropagation();
                          ShowQRCode(item.attributes?.qrcode);
                        }}
                      >
                        <BsQrCodeScan />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <DetailPart item={item} getJWTToken={getJWTToken} />
                      </div>

                      {isStatusPublish[item.id] ? (
                        <div
                          className="tagStatusActive"
                          onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(item.id, false);
                          }}
                        >
                          {/* <GoDotFill /> */}

                          {isLoadingMap[item.id] ? (
                            <Spinner
                              animation="border"
                              size="sm"
                              style={{
                                verticalAlign: "middle",
                                fontSize: "10px",
                              }}
                            />
                          ) : (
                            <GoDotFill />
                          )}

                          <p>active</p>
                        </div>
                      ) : (
                        <div
                          className="tagStatusNotActive"
                          onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(item.id, true);
                          }}
                        >
                          {isLoadingMap[item.id] ? (
                            <Spinner
                              animation="border"
                              size="sm"
                              style={{
                                verticalAlign: "middle",
                                fontSize: "10px",
                              }}
                            />
                          ) : (
                            <GoDotFill />
                          )}

                          <p>Inactive</p>
                        </div>
                      )}
                    </div>
                  ))}

                {listAsset

                  .filter(
                    (value) =>
                      value.attributes.thumbnail !== "null" &&
                      !checkImageDefault(value.attributes.thumbnail)
                  )

                  .map((item, index) => (
                    <div
                      onClick={() =>
                        onClickDetailAsset(item.attributes.assetUID)
                      }
                      style={{
                        width: "100%",
                        padding: "100% 0px 0px 0px",
                        position: "relative",
                        margin: "10px 0px",
                        boxSizing: "border-box",
                      }}
                    >
                      <Card.Img
                        variant="left"
                        src={item?.attributes?.thumbnail}
                        style={{
                          width: "100%",

                          height: "90%",

                          borderRadius: "8px",

                          position: "absolute",

                          top: "0",

                          left: "0",

                          display: "flex",

                          alignItems: "center",

                          justifyContent: "center",

                          objectFit: "cover",

                          border: "1px solid var(--gray-300, #DEE2E6)",

                          background: "var(--gray-100, #F8F9FA)",

                          boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                      />

                      <p className="titleItemsDefault">
                        {!checkImageDefault(item?.attributes?.thumbnail)
                          ? "Default Image"
                          : ""}
                      </p>

                      <div className="titleItems">
                        <div className="btnDelete">
                          <TiDelete
                            className="iconDelete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleModalDeleteModelShow(item);
                            }}
                          />
                        </div>

                        <div className="groupTitle">
                          <div className="bodyTitle">
                            <p>{data[0].attributes.title}</p>

                            <p className="idModel">
                              <b>Model:</b> {item?.attributes?.name}
                            </p>
                          </div>
                        </div>

                        <div></div>
                      </div>
                      <div
                        className="tagQRCode"
                        onClick={(e) => {
                          e.stopPropagation();
                          ShowQRCode(item.attributes?.qrcode);
                        }}
                      >
                        <BsQrCodeScan />
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <DetailPart item={item} getJWTToken={getJWTToken} />
                      </div>

                      {isStatusPublish[item.id] ? (
                        <div
                          className="tagStatusActive"
                          onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(item.id, false);
                          }}
                        >
                          {isLoadingMap[item.id] ? (
                            <Spinner
                              animation="border"
                              size="sm"
                              style={{
                                verticalAlign: "middle",
                                fontSize: "10px",
                              }}
                            />
                          ) : (
                            <GoDotFill />
                          )}

                          <p>active</p>
                        </div>
                      ) : (
                        <div
                          className="tagStatusNotActive"
                          onClick={(e) => {
                            e.stopPropagation();
                            changeStatus(item.id, true);
                          }}
                        >
                          {isLoadingMap[item.id] ? (
                            <Spinner
                              animation="border"
                              size="sm"
                              style={{
                                verticalAlign: "middle",
                                fontSize: "10px",
                              }}
                            />
                          ) : (
                            <GoDotFill />
                          )}

                          <p>Inactive</p>
                        </div>
                      )}
                    </div>
                  ))}

                {listAsset
                  .filter((value) => value.attributes.thumbnail === "null")
                  .map((item, index) => (
                    <div
                      style={{
                        width: "100%",
                        padding: "100% 0px 0px 0px",
                        position: "relative",
                        margin: "10px 0px",
                        boxSizing: "border-box",
                      }}
                    >
                      <div className="box">
                        <div class="lds-roller">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>

                        <p className="titleLoad">Loading</p>
                      </div>
                    </div>
                  ))}

                <div
                  style={{
                    width: "100%",
                    padding: "100% 0px 0px 0px",
                    position: "relative",
                    margin: "10px 0px",
                    boxSizing: "border-box",
                  }}
                >
                  <div className="container">
                    <label
                      className="label-input"
                      for="file-input"
                      onClick={() => {
                        setShow(true);
                        setErrors({});
                      }}
                    >
                      <Icon
                        as={MdAdd}
                        style={{
                          padding: "0px 0px 5px",
                          width: "25px",
                          height: "25px",
                          color: "#0D6EFD",
                        }}
                      />

                      <a style={{ color: "#0D6EFD" }}>Upload</a>
                    </label>

                    <Modal
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
                        <Form
                          noValidate
                          validated={validated}
                          enctype="multipart/form-data"
                        >
                          <Form.Control.Feedback
                            type="invalid"
                            style={{ display: "block", textAlign: "center" }}
                          >
                            {errors.strapi}
                          </Form.Control.Feedback>
                          <Form.Group className="position-relative mb-3">
                            <Form.Label>Asset name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter name asset"
                              value={nameAsset}
                              onChange={(e) => setNameAsset(e.target.value)}
                              required
                            />

                            <Form.Control.Feedback type="invalid">
                              {errors.nameAsset}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Label>
                            <b>3D Model</b>
                          </Form.Label>
                          <InputGroup className="mb-3">
                            <Form.Control
                              id="file"
                              type="file"
                              accept=".obj*, .blend, .fbx, .gltf, .glb, .zip"
                              onChange={handleFileChange}
                              isInvalid={limitedSize}
                              required
                            />

                            <Form.Control.Feedback type="invalid">
                              {!limitedSize ? (
                                <>{errors.file}</>
                              ) : (
                                <>
                                  This file is too big to load. Please limit the
                                  file to &lt; 50MB
                                </>
                              )}
                            </Form.Control.Feedback>
                          </InputGroup>

                          <ProgressBar
                            animated={percentage < 100}
                            now={percentage}
                            onUploading
                            label={
                              percentage < 100 ? `${percentage}%` : "Successful"
                            }
                          />
                        </Form>
                      </Modal.Body>

                      <Modal.Footer>
                        <Button
                          variant="light"
                          disabled={onUploading}
                          onClick={handleClose}
                        >
                          {" "}
                          Close{" "}
                        </Button>

                        <Button
                          disabled={!selectFile}
                          onClick={handleSubmit}
                          style={{ borderRadius: "2px" }}
                        >
                          Submit
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
            </Card.Body>

            <Modal
              size="s"
              show={qrShow}
              onHide={() => {
                setQRShow(false);
                setImgQRCode("");
              }}
            >
              <Modal.Header closeButton></Modal.Header>

              <Modal.Body>
                <Card.Img src={imgQRCode} />
              </Modal.Body>
            </Modal>

            <Modal
              size="lg"
              show={lgShow}
              onShow={onShow}
              onHide={() => setLgShow(false)}
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton></Modal.Header>

              <Modal.Body>
                <div style={{ height: "40rem" }}>
                  <iframe
                    id="api-frame-detail"
                    data-uid={uID}
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
                    src={`https://sketchfab.com/models/${uID}/embed`}
                    style={{
                      width: "100%",

                      height: "100%",
                    }}
                  ></iframe>
                </div>
              </Modal.Body>
            </Modal>
          </Card>
        </Box>
        {data.length !== 0 && (
          <ModalEditProduct
            showModalEditProduct={showModalEditProduct}
            handleModalEditProductClose={handleModalEditProductClose}
            data={data}
            getJWTToken={getJWTToken}
            onSubmitSuccessEdit={handleModalSubmitSuccessEdit}
            handleNewProductId={handleNewProductId}
          />
        )}

        <DeleteModel
          showModalDeleteModel={showModalDeleteModel}
          handleModalDeleteModelClose={handleModalDeleteModelClose}
          data={data}
          tokenSket={tokenSket}
          getJWTToken={getJWTToken}
          onSubmitSuccessDelete={handleModalSubmitSuccessDelete}
          dataDelete={dataDelete}
        />

        <ModalUpdateAsset
          showModalUpdateAsset={showModalUpdateAsset}
          setShowModalUpdateAsset={setShowModalUpdateAsset}
          handleModalUpdateAssetClose={handleModalUpdateAssetClose}
          handleModalUpdateAsset={handleModalUpdateAsset}
          getJWTToken={getJWTToken}
          dataAsset={dataAsset}
          tokenSket={tokenSket}
        />
      </>
    );
  } else {
    return null;
  }
};

export default DetailProduct;
