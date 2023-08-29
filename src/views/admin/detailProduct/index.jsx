import {
    Box, Icon, color
} from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { http } from '../../../axios/init';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { useLocation } from 'react-router-dom';
import Sketchfab from "@sketchfab/viewer-api";
import { MdOutlineEdit, MdAdd } from "react-icons/md";
import './styleDetail.css'

const DetailProduct = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const businessId = searchParams.get('id');
    const productId = searchParams.get('productID');
    const [data, setData] = useState([])
    const [listAsset, setListAsset] = useState([])
    const getJWTToken = localStorage.getItem('dtvt');
    const [uID, setUID] = useState('');
    const [lgShow, setLgShow] = useState(false);

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

    useEffect(() => {
        http.get(`products?filters[businessId][$eq]=${businessId}`, {
            headers: {
                Authorization: `Bearer ${getJWTToken}`,
            },
        })
            .then((response) => {
                const objectData = response.data.data
                const objectsData = [...objectData]
                const objectsDataOfProduct = objectsData.filter((value) => value?.attributes?.productId === productId)
                setData(objectsDataOfProduct)

            })
            .catch((err) => err)

        http.get(`assets?filters[productId][$eq]=${productId}`, {
            headers: {
                Authorization: `Bearer ${getJWTToken}`,
            },
        })
            .then((response) => {
                const objectData = response.data.data
                const objectsData = [...objectData]
                setListAsset(objectsData)

            })
            .catch((err) => err)


    }, [])

    useEffect(() => {
        autoPlayAll3DViewers();
    }, [listAsset])

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
        setLgShow(true)
        setUID(value)
    }

    if (businessId !== null && businessId !== '' && listAsset.length !== 0) {
        return (
            <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
                {data.map((item, index) => (
                    <Card key={index} style={{ margin: "30px 10px", borderRadius: "16px" }}>
                        <Card.Body>
                            <Row>
                                <Col xs={4} style={{ padding: "30px 0" }}>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Card.Img variant="left" src={item?.attributes?.thumbnail} style={{ width: '360px' }} />
                                    </div>
                                </Col>
                                <Col xs={8} style={{ padding: "30px 32px 30px 70px" }}>
                                    <Card.Title style={{ marginBottom: '10px', fontSize: "40px", fontWeight: "bold" }}>{item?.attributes?.title}</Card.Title>
                                    <Card.Text style={{ margin: '16px 0px 8px 0px', color: "#6C757D" }}>
                                        Product ID:  {item?.attributes?.productId}
                                    </Card.Text>
                                    <Card.Text style={{ marginBottom: '8px', color: "#6C757D" }}>
                                        Brand:  <a href="#" style={{ color: "#0D6EFD", fontWeight: "bold" }}>{item?.attributes?.brand}</a>
                                    </Card.Text>
                                    <Card.Text style={{ marginBottom: '8px', color: "#6C757D" }}>
                                        Stock:  <a href="#" style={{ color: "#479F76" }}>{item?.attributes?.stock}</a>
                                    </Card.Text>
                                    <Card.Text style={{ margin: '16px 0px 16px 0px', color: "#212529", fontSize: "20px", textAlign: "left" }}>
                                        {item?.attributes?.description}
                                    </Card.Text>
                                    <div className="position-absolute bottom-0 end-0 text-muted" style={{ margin: "0px 50px 50px 0 " }}>
                                        <Icon as={MdOutlineEdit} style={{ padding: "0px 0px 5px", width: '25px', height: '25px', color: "#0D6EFD" }} />
                                        <u style={{ color: "#0D6EFD", marginLeft: "8px", textDecoration: "underline", fontSize: "18px" }}>Edit</u>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}

                <Card.Title style={{ margin: '69px 0px 38px 10px ', fontSize: "35px", fontWeight: "bold", color: "#212529" }}>3D Models</Card.Title>
                <Card style={{ margin: "30px 10px" }}>
                    <Card.Body>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: "50px", padding: "32px" }}>
                            {listAsset.map((item, index) => (
                                <div onClick={() => onClickDetailAsset(item.attributes.assetUID)} style={{ width: "100%", padding: "100% 0px 0px 0px", position: "relative", margin: "10px 0px", boxSizing: "border-box" }}>
                                    <Card.Img variant="left" src={item?.attributes?.thumbnail} style={{
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
                                        background: "var(--gray-100, #F8F9FA)"
                                    }} />
                                </div>

                            ))}

                            <div style={{ width: "100%", padding: "100% 0px 0px 0px", position: "relative", margin: "10px 0px", boxSizing: "border-box" }}>
                                <div className="container">
                                    <input type="file" id="file-input" multiple></input>
                                    <label className="label-input" for="file-input">
                                        <Icon as={MdAdd} style={{ padding: "0px 0px 5px", width: '25px', height: '25px', color: "#0D6EFD" }} />
                                        <a style={{ color: "#0D6EFD" }}>Upload</a>
                                    </label>
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
                        <Modal.Header closeButton>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ height: '40rem' }}>
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
        )
    }
    else {
        return null
    }


}
export default DetailProduct



