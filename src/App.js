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
import YourLocationMap from "./components/YourLocationMap";
import FriendLocation from "./components/FriendLocation";
import Movies from "./components/Movies";
import socket from "socket.io-client";
import { API_BASE_URL } from "./helpers";
import { userData } from "./helpers";

function App() {
  const TOKEN_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

  const socketInstance = socket(API_BASE_URL); // Initialize Socket.IO once
  const loggedInUserName = userData().username;

  const [loggedIn, setLoggedIn] = useState(false);

  // Separate useEffect to log userId and emit 'UserOnline' via socket every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user); // Parse the user object
        const userId = parsedUser.id; // Access the userId from the parsed object
        if (userId) {
          console.log("Logged-in User ID:", userId); // Log the userId
          // socketInstance.emit("UserOnline", userId);
          socketInstance.emit("UserOnline", {
            userId
          }); // Emit 'UserOnline' with the userId to the server
        }
      }
    }, 5000); // Log and emit every 5 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // This effect runs once when the component is mounted

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

  useEffect(() => {
    socketInstance.on("findCord", (data) => {
      const { targetUser1, senderUser1 } = data;
      const loggedInUserId = userData().id; // Get the logged-in user's ID

      if (targetUser1 === loggedInUserId) {
        socketInstance.emit("sendCordSend", {
          senderUser1,
          targetUserName: userData().username,
          lan: localStorage.getItem("lan"),
          long: localStorage.getItem("long"),
        });
      }
    });
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
          <Route path="/your-location" element={<YourLocationMap />} />
          <Route path="/friend-location/:id" element={<FriendLocation />} />
          <Route path="/movies" element={<Movies />} />
        </Routes>
      </HashRouter>
    </Container>
  );
}

export default App;
