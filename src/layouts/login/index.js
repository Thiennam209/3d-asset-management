import React, { useState } from "react";
import { Spinner, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { http } from "../../axios/init";
import { Flex } from "@chakra-ui/react";
import logoFPT from "../../assets/img/showroom_pic1.png";
import { Link } from "react-router-dom";
import { MDBIcon } from "mdbreact";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const postAPILogin = () => {
    http
      .post("auth/local", {
        identifier: email,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          const token = response.data.jwt;
          const user = {
            username: response.data.user.username,
            email: response.data.user.email,
            businessId: response.data.user.businessId,
            userType: response.data.user.userType,
            roles: response.data.user.roles,
          };
          localStorage.setItem("dtvt", token);
          localStorage.setItem("info", JSON.stringify(user));
          setLoading(false);
          window.location.replace("/");
        } else {
          const errors = {};
          errors.author = "This email doesn't have access rights";
          setErrors(errors);
          setEmail("");
          setPassword("");
          setLoading(false);
        }
      })
      .catch((error) => {
        const errors = {};
        errors.author = "Email or password is invalid";
        setErrors(errors);
        setEmail("");
        setPassword("");
        setLoading(false);
      });
  };

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = "This value is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "This is an invalid email";
    }

    if (!password) {
      errors.password = "This value is required.";
    }

    return errors;
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const errors = validateForm();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (email && password) {
      // Xử lý khi biểu mẫu hợp lệ
      setLoading(true);
      postAPILogin();
    } else {
      // Hiển thị thông báo lỗi
      setErrors(errors);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#0b1437" }}
    >
      <div
        className="p-4 shadow-lg rounded bg-white"
        style={{ width: "636px" }}
      >
        <Flex align="center" direction="column">
          <img
            src={logoFPT}
            alt="logo"
            style={{ width: "50%", padding: "30px" }}
          />
        </Flex>
        <h2
          className="text-center"
          style={{ color: "black", fontSize: "2rem" }}
        >
          Log in to your account
        </h2>
        <h5 className="text-center mb-4" style={{ color: "black" }}>
          Welcome to 3D CMS portal! Please enter your details.
        </h5>
        <Form
          style={{ color: "black", margin: "0 15%" }}
          noValidate
          validated={validated}
        >
          <Form.Control.Feedback
            style={{ display: "block", textAlign: "center" }}
            type="invalid"
          >
            {errors.author}
          </Form.Control.Feedback>
          <Form.Group controlId="formBasicEmail" style={{ margin: "10px 0" }}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            controlId="formBasicPassword"
            style={{ margin: "10px 0" }}
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            controlId="rememberMe"
            className="d-flex justify-content-between"
          >
            <div>
              <Form.Check type="checkbox" label="Remember Me" />
            </div>
            <div>
              <Link to="#">Forgot Password?</Link>
            </div>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            block
            onClick={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: "#007bff",
              borderColor: "#007bff",
              marginTop: "20px",
              width: "100%",
            }}
          >
            Sign in{" "}
            {loading && (
              <Spinner
                animation="border"
                size="sm"
                style={{ verticalAlign: "middle" }}
              />
            )}
          </Button>

          <Button
            variant="outline-primary"
            type="button"
            block
            // onClick={handleLogin}
            style={{
              backgroundColor: "white",
              borderColor: "#007bff",
              marginTop: "20px",
              width: "100%",
              color: "#007bff",
            }}
          >
            <MDBIcon fab icon="google" style={{ margin: "0" }} /> Sign in with
            Google
          </Button>
          <h5
            className="text-center"
            style={{ color: "black", margin: "50px 0 80px 0" }}
          >
            {" "}
            Don’t have an account? <Link to="#"> Sign up</Link>
          </h5>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
