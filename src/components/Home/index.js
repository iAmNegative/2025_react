import React from "react";
import { useNavigate } from "react-router-dom";
import CustomNav from "../CustomNav";
import { userData } from "../../helpers";
import "./Home.css";
import { Container } from "reactstrap";
import { Link } from "react-router-dom";

const Home = () => {
  const { username } = userData();
  const navigate = useNavigate();

  return (
    <Container>
      <CustomNav />
      <div className="home">
        <h2 className="welcome-header">Welcome, {username || "Player"}</h2>
        {username && (
          <Link to="/messages" className="action-button messages-button">
            Start Chatting
          </Link>
        )}
        {username && (
          <Link to="/posts" className="action-button posts-button">
            View Posts
          </Link>
        )}
      </div>
    </Container>
  );
};

export default Home;
