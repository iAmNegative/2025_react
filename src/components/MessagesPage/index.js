import React, { useState, useEffect ,useRef } from "react";
import CustomNav from "../CustomNav";
import axios from "axios";
import { userData } from "../../helpers";
import { Link } from "react-router-dom";
import io from "socket.io-client"; // Import socket.io-client
import "./MessagePage.css"; // Import the custom stylesheet for MessagesPage component
import { API_BASE_URL } from "../../helpers";

const { jwt } = userData();

const MessagesPage = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set()); // Track online users
  const { username } = userData();
  const [joined, setJoined] = useState(false);
  const socket = useRef(null); // Create a reference for the socket connection

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io(API_BASE_URL); // Connect to your server's Socket.io instance

    socket.current.on("user-online", (userId) => {
      setOnlineUsers((prev) => new Set(prev.add(userId)));
    });

    socket.current.on("user-offline", (userId) => {
      setOnlineUsers((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.delete(userId);
        return updatedSet;
      });
    });

    // Fetch users when the component mounts
    fetchUsers();

    return () => {
      socket.current.disconnect(); // Disconnect on component unmount
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const filteredUsers = response.data.filter(
        (user) => user.username !== username
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div>
      <CustomNav />
      <div className="messages-page">
        <h2 className="page-header">Friends List</h2>
        <div className="users">
          <ul>
            {users.map((user) => (
              <li key={user.id} className="user">
                <div className="user-info">
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="username">{user.username}</p>
                  <p className="email">{user.email}</p>
                  {/* Display green dot if the user is online */}
                  <span
                    className={`status-dot ${
                      onlineUsers.has(user.id) ? "online" : "offline"
                    }`}
                  ></span>
                </div>
                <Link to={`/view-messages/${user.id}`}>
                  <button className="view-button">View Messages</button>
                </Link>
                <Link to={`/friend-location/${user.id}`}>
                  <button className="view-button">Find {user.username}</button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
