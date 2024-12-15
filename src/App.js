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
import socket from "socket.io-client";
import { API_BASE_URL } from "./helpers";
import { userData } from "./helpers";




function App() {
  const TOKEN_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

  const socketInstance = socket(API_BASE_URL); // Initialize Socket.IO once


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

  useEffect(() => {
  
      socketInstance.on("findCord", (data) => {
  
            // console.log(` request code 2 :  reciver to user server ${targetUser1} and i am login as ${loggedInUserId} `);
  
  
        const { targetUser1, senderUser1 } = data;
        const loggedInUserId = userData().id; // Get the logged-in user's ID
        
        // console.log(`findLocationSend: Target user ${targetUser1}, Sender user ${senderUser1}`);
  
        // socketInstance.emit("sendCordSend", {  senderUser1, targetUser1: loggedInUserId,
        //   lan:  localStorage.getItem("lan"),
        //   long:  localStorage.getItem("long"),
        // });
        console.log(` request code 2 :  reciver to user server ${targetUser1} and i am login as ${loggedInUserId} `);
  
        if (targetUser1 == loggedInUserId) {
           
          console.log(` request code 3 :  send to server : lan ${localStorage.getItem("lan")} ,  ${localStorage.getItem("long")} to  ${senderUser1} , and i am login as ${loggedInUserId} `);
  
          socketInstance.emit("sendCordSend", {  senderUser1, targetUser1: loggedInUserId,
            lan:  localStorage.getItem("lan"),
            long:  localStorage.getItem("long"),
          });
  
    
        }
  
        
      });
  
  },[]);

 

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
          <Route path="/your-location" element={<YourLocationMap />} /> {/* Add this route */}
          <Route path="/friend-location/:id" element={<FriendLocation/>} /> {/* Add this route */}




        </Routes>
      </HashRouter>
    </Container>
  );
}

export default App;
