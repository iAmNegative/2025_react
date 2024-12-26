import React, { useState } from "react";
import { Col, Row, Button, FormGroup, Input } from "reactstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; // Reusing the same CSS for consistent styling
import { API_BASE_URL } from "../../helpers";


const initialUser = { username: "", email: "", password: "", firstName: "", lastName: "" };

const Registration = () => {
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    const url = `${API_BASE_URL}/api/auth/local/register`;

    try {
      if (user.username && user.email && user.password && user.firstName && user.lastName) {
        await axios.post(url, user);
        toast.success("Registration successful!", {
          hideProgressBar: true,
        });
        setUser(initialUser);
        navigate("/login");
      } else {
        toast.error("Please fill in all fields.", {
          hideProgressBar: true,
        });
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.", {
        hideProgressBar: true,
      });
    }
  };

  return (
    <>
      <Row className="login">
        <Col>
          <div>
            <h2>
              <span className="thunder">Thunder</span>
              <span className="chat">Chat</span>
            </h2>
            <h2>Sign Up</h2>

            <FormGroup>
              <Input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </FormGroup>

            <FormGroup>
              <Input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
            </FormGroup>

            <FormGroup>
              <Input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
            </FormGroup>

            <FormGroup>
              <Input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </FormGroup>

            <FormGroup>
              <Input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </FormGroup>

            <Button color="primary" onClick={handleRegister}>
              Sign Up
            </Button>
            <h6>
              <span className="thunder">OR</span>
            </h6>
            <h6>
              Already have an account? <Link to="/login">Sign In</Link>
            </h6>
          </div>
        </Col>
      </Row>
      <ToastContainer position="top-center" autoClose={5000} />
    </>
  );
};

export default Registration;
