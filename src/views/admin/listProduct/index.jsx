import {
    Box, Icon
} from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { http } from '../../../axios/init';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useLocation, Link } from 'react-router-dom';
import { MdOutlineEdit, MdAdd } from "react-icons/md";
import './css.css'
import routes from "routes";
const ListProduct = () => {
    const location = useLocation();

    const [data, setData] = useState([])
    const [businessId, setBusinessId] = useState("")
    const getJWTToken = localStorage.getItem('dtvt');

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const getIDBusiness = searchParams.get('id');
        if (getIDBusiness !== null) {
            setBusinessId(getIDBusiness)
            http.get(`products?filters[businessId][$eq]=${getIDBusiness}`, {
                headers: {
                    Authorization: `Bearer ${getJWTToken}`,
                },
            })
                .then((response) => {
                    const objectData = response.data.data
                    const objectsData = [...objectData]
                    setData(objectsData)
                })
                .catch((err) => err)
        }
    }, [])

    return (
        <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
            <Button variant="primary" style={{ float: "right", margin: "15px 10px" }}><Link to="#" className="btnView"> Add new product </Link></Button>
            {data.map((item, index) => (
                <Card key={index} style={{ margin: "30px 10px", borderRadius: "16px", clear: "both" }}>
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
                                <Button variant="primary"><Link to={`/admin/list-products/detail-product?id=${businessId}&&productID=${item?.attributes?.productId}`} className="btnView"> View Product Detail </Link></Button>
                                <div className="position-absolute bottom-0 end-0 text-muted" style={{ margin: "0px 50px 50px 0 " }}>
                                    <Icon as={MdOutlineEdit} style={{ padding: "0px 0px 5px", width: '25px', height: '25px', color: "#0D6EFD" }} />
                                    <u style={{ color: "#0D6EFD", marginLeft: "8px", textDecoration: "underline", fontSize: "18px" }}>Edit</u>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            ))}

        </Box>
    )
}
export default ListProduct
