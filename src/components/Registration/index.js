import React, { useState } from "react";
import { Col, Row, Button, FormGroup, Input } from 'reactstrap';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../helpers";


const initialUser = { password: "", email: "", username: "", firstName: "", lastName: "" };

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

const handleSignup = async () => {
  const url = `${API_BASE_URL}/api/auth/local/register`;
  try {
    if (user.email && user.password && user.firstName && user.lastName && user.username) {
      const response = await axios.post(url, user);
      if (response.data.error && response.data.error.message) {
        const errorMessage = response.data.error.message;
        toast.error(errorMessage, {
          hideProgressBar: true,
        });
      } else if (!response.data.error) {
        toast.success("Registered successfully!", {
          hideProgressBar: true,
        });
        setUser(initialUser);
        navigate("/login");
      }
    }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.error.message, {
        hideProgressBar: true,
      });
    } else {
      toast.error("An error occurred while registering. Please try again later.", {
        hideProgressBar: true,
      });
    }
  }
};


  return (
    <>
    <Row className="register">
      <Col sm="12" md={{ size: 4, offset: 4 }}>
        <div>
          <h2>Sign up:</h2>

          <FormGroup>
            <Input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Enter UserID" />
          </FormGroup>

          <FormGroup>
            <Input type="text" name="firstName" value={user.firstName} onChange={handleChange} placeholder="Enter first name" />
          </FormGroup>

          <FormGroup>
            <Input type="text" name="lastName" value={user.lastName} onChange={handleChange} placeholder="Enter last name" />
          </FormGroup>

          <FormGroup>
            <Input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Enter email" />
          </FormGroup>

          <FormGroup>
            <Input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Enter password" />
          </FormGroup>

          <Button color="primary" onClick={handleSignup}>Sign up</Button>
          <h6>
            Click <Link to="/login">Here</Link> to sign in
          </h6>
        </div>
      </Col>
    </Row>
    <ToastContainer position="top-center" autoClose={5000} />
    </>
  );
};

export default Registration;
