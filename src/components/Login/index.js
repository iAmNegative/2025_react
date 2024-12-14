import React, { useState,useRef,useEffect } from "react";
import { Col, Row, Button, FormGroup, Input } from "reactstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { storeUser } from "../../helpers";
import "./Login.css";
import { API_BASE_URL } from "../../helpers";
import "react-toastify/dist/ReactToastify.css";



const initialUser = { password: "", identifier: "" };
const Login = () => {
  const [user, setUser] = useState(initialUser);
  const navigate = useNavigate();

  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // Ensure map is initialized only once


  const handleChange = ({ target }) => {
    const { name, value } = target;

    setUser((currentUser) => ({
      ...currentUser,
      [name]: value,
    }));
  };


  const handleLogin = async () => {
    const url = `${API_BASE_URL}/api/auth/local`;

    try {
      if (user.identifier && user.password) {
        const { data } = await axios.post(url, user);
        if (data.jwt) {
          

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                console.log("Latitude:", pos.coords.latitude, "Longitude:", pos.coords.longitude);
                localStorage.setItem("token", "0");
                localStorage.setItem("loginTime", Date.now().toString());
              },
              (err) => {
                console.log("Geolocation error:", err.message);
                localStorage.setItem("lan", "0");
                localStorage.setItem("long", "0");
                setError(err.message || "Failed to retrieve location.");
              }
            );
          } else {
            setError("Geolocation is not supported by this browser.");
          }


          storeUser(data);
          toast.success("Logged in successfully!", {
            hideProgressBar: true,
          });
          setUser(initialUser);

          
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("Invalid credentials. Please try again.", {
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
          <h2>Sign In</h2>
   
          <FormGroup>
            <input
              type="email"
              name="identifier"
              value={user.identifier}
              onChange={handleChange}
              placeholder="Username or email"
            />
          </FormGroup>

          <FormGroup>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </FormGroup>

          <Button color="primary" onClick={handleLogin}>
            Sign In
          </Button>
          <h6>
            <span className="thunder">OR</span>
          </h6>
          <h6>
            Click <Link to="/registration">Here</Link> to Sign up
          </h6>
        </div>
      </Col>
    </Row>
     <ToastContainer position="top-center" autoClose={5000} />
     </>
  );
};

export default Login;


