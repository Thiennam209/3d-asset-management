import { Table, Row, Col } from 'react-bootstrap';
import {
    Box
} from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { http } from '../../../axios/init';

const ListBusiness = () => {
    const getJWTToken = localStorage.getItem('dtvt');
    const [data, setData] = useState([])
    useEffect(() => {
        http.get("businesses", {
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
    }, [])
    return (
        <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
            <Table striped bordered hover className="text-center">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>ID Number</th>
                        <th>Try-Out Manager</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td style={{verticalAlign: "middle"}}><Link to={`list-product?id=${item?.attributes?.businessId}`}>{item?.attributes?.Name}</Link></td>
                            <td style={{verticalAlign: "middle"}}>{item?.attributes?.businessId}</td>
                            <td style={{verticalAlign: "middle"}}>
                                <div style={{ alignItems: "center", display: "inline-flex", justifyContent: "center", position: "relative" }}>
                                    <div style={{ width: "40px", height: "40px", objectFit: "cover", position: "relative" }}>
                                        <img src={item?.attributes?.ManagerImage} alt="null" />
                                    </div>
                                    <div style={{ alignItems: "center", display: "inline-flex", flex: "0 0 auto", gap: "10px", justifyContent: "center", padding: "10px 10px 10px 16px", position: "relative" }}>
                                        {item?.attributes?.Manager}
                                    </div>
                                </div>
                            </td>
                            <td style={{verticalAlign: "middle"}}>Add</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Box>

    )
}
export default ListBusiness