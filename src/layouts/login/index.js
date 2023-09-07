import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { http } from '../../axios/init';
import { Flex, useColorModeValue } from "@chakra-ui/react";
import logoFPT from "../../assets/img/showroom_pic1.png";
import { Link } from 'react-router-dom';
import { MDBIcon } from 'mdbreact';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const postAPILogin = () => {
        http.post('auth/local', {
            "identifier": email,
            "password": password
        })
            .then((response) => {
                if (response.status === 200) {
                    const token = response.data.jwt
                    localStorage.setItem('dtvt', token);
                    window.location.reload();
                    // setAuth(true)
                } else {
                    setEmail("")
                    setPassword("")
                }
            })
            .catch((error) => {
                setEmail("")
                setPassword("")
            });
    }
    const handleLogin = () => {
        // Xử lý đăng nhập tại đây
        postAPILogin()
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh', backgroundColor: '#0b1437' }}
        >
            <div className="p-4 shadow-lg rounded bg-white" style={{ width: '636px' }}>
                <Flex align='center' direction='column'>
                    <img src={logoFPT} alt="image" style={{ width: "50%", padding: "30px" }} />
                </Flex>
                <h2 className="text-center" style={{ color: 'black', fontSize: '2rem' }}>Log in to your account</h2>
                <h5 className="text-center mb-4" style={{ color: 'black' }}>Welcome to 3D CMS portal! Please enter your details.</h5>
                <Form style={{ color: 'black', margin: '0 15%' }}>
                    <Form.Group controlId="formBasicEmail" style={{ margin: "10px 0" }}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" style={{ margin: "10px 0" }}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="rememberMe" className="d-flex justify-content-between">
                        <div>
                            <Form.Check
                                type="checkbox"
                                label="Remember Me"
                            />
                        </div>
                        <div>
                            <Link to="#">Forgot Password?</Link>
                        </div>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="button"
                        block
                        onClick={handleLogin}
                        style={{ backgroundColor: '#007bff', borderColor: '#007bff', marginTop: '20px', width: '100%' }}
                    >
                        Sign in
                    </Button>

                    <Button
                        variant="outline-primary"
                        type="button"
                        block
                        style={{ backgroundColor: 'white', borderColor: '#007bff', marginTop: '20px', width: '100%', color: '#007bff' }}
                    >
                        <MDBIcon fab icon="google" style ={{margin: "0"}}/> Sign in with Google
                    </Button>
                    <h5 className="text-center" style={{ color: 'black',margin: "50px 0 80px 0" }}> Don’t have an account? <Link to="#"> Sign up</Link></h5>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
