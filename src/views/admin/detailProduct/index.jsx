import { Box, Divider, Icon, color } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import { http, urlStrapi } from "../../../axios/init";

import Card from "react-bootstrap/Card";

import Button from "react-bootstrap/Button";

import Row from "react-bootstrap/Row";

import Col from "react-bootstrap/Col";

import Modal from "react-bootstrap/Modal";

import { useLocation } from "react-router-dom";

import Sketchfab from "@sketchfab/viewer-api";

import { MdOutlineEdit, MdAdd } from "react-icons/md";

import "./styleDetail.css";

import { Form, Alert } from "react-bootstrap";

import InputGroup from "react-bootstrap/InputGroup";

import ProgressBar from "react-bootstrap/ProgressBar";

import "bootstrap/dist/css/bootstrap.min.css";
import { BsSearch, BsFillCheckCircleFill } from "react-icons/bs";

import axios from "axios";
import ModalEditProduct from "./component/modalEditProduct";
import DeleteModel from "./component/deleteModel";
import { TiDelete } from "react-icons/ti";
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

  const [percentage, animateProgress] = useState(0);

  const [onUploading, setStatusUpload] = useState(false);

  const [uid, setUid] = useState("");
  const [modelQuantity, setModelQuatity] = useState("");
  const [arrayAssetId, setArrayAssetId] = useState([]);
  const [updateAsset, setUpdateAsset] = useState(false);
  const [successMessageEdit, setSuccessMessageEdit] = useState("");
  const [successMessageDelete, setSuccessMessageDelete] = useState("");

  const [showModalEditProduct, setShowModalEditProduct] = useState(false);
  const [showModalDeleteModel, setShowModalDeleteModel] = useState(false);
  const [dataEdit, setDataEdit] = useState([]);
  const [dataDelete, setDataDelete] = useState([]);
  const [productId, setProductId] = useState(_productId);
  const handleModalEditProductClose = () => setShowModalEditProduct(false);
  const handleModalEditProductShow = (data) => {
    setShowModalEditProduct(true);
    setDataEdit(data);
  };
  const handleModalDeleteModelClose = () => setShowModalDeleteModel(false);
  const handleModalDeleteModelShow = (data) => {
    console.log("data ::::::::", data);

    debugger;
    setShowModalDeleteModel(true);
    setDataDelete(data);
  };
  const handleClose = () => {
    setShow(false);

    enableUploadButton(false);

    animateProgress(0);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);

    enableUploadButton(true);
  };

  const handleSubmit = async (event) => {
    console.log(`handleSubmit: process ${percentage}`);

    setStatusUpload(true);

    enableUploadButton(false);

    const formData = new FormData();

    formData.append("modelFile", file);

    formData.append("isInspectable", true);

    formData.append("license", "by");

    try {
      // Upload model to Sketchfab

      const response = await axios("https://api.sketchfab.com/v3/models", {
        method: "POST",

        headers: { Authorization: `Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN` },

        data: formData,

        onUploadProgress: (event) => {
          const { loaded, total } = event;

          let per = Math.floor((loaded * 100) / total);

          console.log(`Process ${per}%`);

          animateProgress(per);
        },
      });

      if (response.status == 201) {
        console.log("UPLOAD SUCESSFUL");

        // Create new asset in Strapi

        const uidResponse = response.data.uid;

        const name = file.name;

        var dataRes = {
          data: {
            assetUID: uidResponse,

            description: name,

            productId: productId,

            isPublished: false,

            thumbnail: "null",
          },
        };

        const modelInfo = await http
          .post("assets", dataRes, {
            headers: {
              Authorization: `Bearer ${getJWTToken}`,
            },
          })
          .then((res) => {
            debugger;
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
                console.log("up load thành công");
              })
              .catch((err) => {
                console.log(err);
              });
          });

        console.log("modelInfo", modelInfo);

        setUid(uidResponse);

        setStatusUpload(false);
      }
    } catch (error) {
      console.error("Error occurred:", error);
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
            // console.log("Viewer is ready");
          });
        },

        error: function onError() {
          console.log("Viewer error");
        },
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
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const getIdBusiness = searchParams.get("idBusiness");

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

          objectsDataListAssest.forEach((item, index) => {
            if (item.attributes.thumbnail === "null") {
              axios(
                `https://api.sketchfab.com/v3/models/${item.attributes.assetUID}`,
                {
                  method: "GET",

                  headers: {
                    Authorization: "Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN",
                  },
                }
              )
                .then((repo) => {
                  const assetId = item.id;

                  const imageURL = repo.data.thumbnails.images[2].url;

                  if (repo.data.publishedAt !== null) {
                    var dataRequest = {
                      data: {
                        thumbnail: imageURL,

                        status: "default",
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
            } else {
              axios(
                `https://api.sketchfab.com/v3/models/${item.attributes.assetUID}`,
                {
                  method: "GET",

                  headers: {
                    Authorization: "Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN",
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

          // check thumbnails == null

          // http
          //   .get(`assets?filters[productId][$eq]=${productId}`, {
          //     headers: {
          //       Authorization: `Bearer ${getJWTToken}`,
          //     },
          //   })

          //   .then((response) => {
          //     const objectDataListAssest = response.data.data;
          //     const objectsDataListAssest = [...objectDataListAssest];
          //     console.log(
          //       "response.data.length :",
          //       response.data.data["length"]
          //     );
          //     setModelQuatity(response.data.data["length"]);
          //     objectsDataListAssest.forEach((item, index) => {
          //       if (item.attributes.thumbnail === "null") {
          //         axios(
          //           `https://api.sketchfab.com/v3/models/${item.attributes.assetUID}`,
          //           {
          //             method: "GET",

          //             headers: {
          //               Authorization: "Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN",
          //             },
          //           }
          //         )
          //           .then((repo) => {
          //             const assetId = item.id;

          //             const imageURL = repo.data.thumbnails.images[2].url;

          //             if (repo.data.publishedAt !== null) {
          //               var dataRequest = {
          //                 data: {
          //                   thumbnail: imageURL,

          //                   status: "default",
          //                 },
          //               };

          //               http
          //                 .put(`/assets/${assetId}`, dataRequest, {
          //                   headers: {
          //                     Authorization: `Bearer ${getJWTToken}`,
          //                   },
          //                 })

          //                 .then((responseAsset) => {
          //                   setUpdateAsset(true);
          //                 })

          //                 .catch((err) => err);
          //             }
          //           })
          //           .catch((err) => err);
          //       } else {
          //         axios(
          //           `https://api.sketchfab.com/v3/models/${item.attributes.assetUID}`,
          //           {
          //             method: "GET",

          //             headers: {
          //               Authorization: "Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN",
          //             },
          //           }
          //         )
          //           .then((repo) => {
          //             const assetId = item.id;

          //             const imageURL = repo.data.thumbnails.images[2].url;

          //             if (item.attributes.thumbnail !== imageURL) {
          //               var dataRequest = {
          //                 data: {
          //                   thumbnail: imageURL,

          //                   status: "true",
          //                 },
          //               };

          //               http
          //                 .put(`/assets/${assetId}`, dataRequest, {
          //                   headers: {
          //                     Authorization: `Bearer ${getJWTToken}`,
          //                   },
          //                 })

          //                 .then((responseAsset) => {
          //                   setUpdateAsset(true);
          //                 })

          //                 .catch((err) => err);
          //             }
          //           })
          //           .catch((err) => err);
          //       }
          //       setListAsset(objectsDataListAssest);
          //     });
          //   })

          //   .catch((err) => err);
        }
      })

      .catch((err) => err);

    autoPlayAll3DViewers();
  }, [onUploading, updateAsset, successMessageEdit, successMessageDelete]);

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

      error: function onError() {
        console.log("Viewer error");
      },
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
  if (successMessageDelete) {
    setTimeout(() => {
      setSuccessMessageDelete(null);
    }, 3000);
  }
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
        {successMessageDelete && (
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
                          item?.attributes?.testImage?.data?.attributes?.formats
                            ?.thumbnail?.url
                        }
                        style={{ width: "360px" }}
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
                        <p>3D Model Item</p>
                        <TiDelete
                          onClick={() => handleModalDeleteModelShow(item)}
                          className="titleIcon"
                        />
                      </div>
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
                      onClick={() => setShow(true)}
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
                        <Form enctype="multipart/form-data">
                          <InputGroup className="mb-3">
                            <Form.Control
                              id="file"
                              type="file"
                              accept=".obj*, .blend, .fbx, .gltf, .glb"
                              onChange={handleFileChange}
                            />

                            <Button
                              disabled={!selectFile}
                              onClick={handleSubmit}
                            >
                              Upload
                            </Button>
                          </InputGroup>

                          <ProgressBar
                            animated={percentage < 100}
                            now={percentage}
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
                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
            </Card.Body>

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
            dataEdit={dataEdit}
            handleNewProductId={handleNewProductId}
          />
        )}
        <DeleteModel
          showModalDeleteModel={showModalDeleteModel}
          handleModalDeleteModelClose={handleModalDeleteModelClose}
          data={data}
          getJWTToken={getJWTToken}
          onSubmitSuccessDelete={handleModalSubmitSuccessDelete}
          dataDelete={dataDelete}
        />
      </>
    );
  } else {
    return null;
  }
};

export default DetailProduct;
