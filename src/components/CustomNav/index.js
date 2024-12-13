import React, { useState, useEffect } from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import { userData } from "../../helpers";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../helpers";
import "./CustomNav.css"; // Import your custom styles
import thunderLogo from "../../thunder-logo.png"; // Adjust the path

const CustomNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const { username } = userData();
  const navigate = useNavigate();

  const toggle = () => {
    setIsOpen(!isOpen);
    setLastActivity(Date.now());
  };

  useEffect(() => {
    const TOKEN_EXPIRATION_TIME = 5 * 60 * 10000; // 3 minutes in milliseconds

    const handleTokenExpiration = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > TOKEN_EXPIRATION_TIME) {
        localStorage.removeItem("lastActivity");
        localStorage.removeItem("userData");
        navigate("/login");
      }
    };

    const tokenExpirationInterval = setInterval(handleTokenExpiration, 100000);
    return () => clearInterval(tokenExpirationInterval);
  }, [lastActivity, navigate]);

  return (
    <div className="custom-nav">
      <Navbar expand="md" className="gaming-navbar">
        <NavbarBrand tag={Link} to="/" className="mr-auto gaming-brand">
          <img src={thunderLogo} alt="Thunder Logo" className="thunder-logo" />
          ThunderChat
        </NavbarBrand>
        <NavbarToggler onClick={toggle} className={`navbar-toggler-icon ${isOpen ? 'open' : ''}`}>
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`} />
        </NavbarToggler>        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {username === null ? (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/registration" className="gaming-link">
                    Register
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/login" className="gaming-link">
                    Sign In
                  </NavLink>
                </NavItem>
              </>
            ) : (
              <>
                <NavItem>
                  <NavLink tag={Link} to="/profile" className="gaming-link gaming-bold">
                    Profile
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/messages" className="gaming-link gaming-bold">
                    Friends
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/Images" className="gaming-link">
                    Images
                  </NavLink>
                </NavItem>
                <NavItem className="ml-auto">
                  <NavLink tag={Link} to="/logout" className="gaming-link gaming-red">
                    Log Out
                  </NavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNav;
