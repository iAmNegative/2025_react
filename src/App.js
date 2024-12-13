import React, { useState, useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Container } from "reactstrap";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Registration from "./components/Registration";
import { Protector } from "./helpers";
import MessagesPage from "./components/MessagesPage";
import MessageViewPage from "./components/MessageViewPage";
import Profile from "./components/Profile";
import MyImage from "./components/MyImage";
import Posts from "./components/Posts";
import VideoChat from "./components/VideoChat";





function App() {
  const TOKEN_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (token && loginTime) {
      const currentTime = Date.now();
      if (currentTime - parseInt(loginTime) > TOKEN_EXPIRATION_TIME) {
        // Token expired, clear token and login time
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("userData");
        window.location.href = "/#/login"; // Redirect to the login page after expiration


      } else {
        // Token still valid
        setLoggedIn(true);
      }
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("loginTime", Date.now().toString());
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    setLoggedIn(false);
  };

  return (
    <Container>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Protector Component={Home} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/view-messages/:id" element={<MessageViewPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/images" element={<MyImage />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/video-chat/:id" element={<VideoChat />} />



        </Routes>
      </HashRouter>
    </Container>
  );
}

export default App;
