import React, { useState, useEffect } from "react";
import CustomNav from "../CustomNav";
import axios from "axios";
import { userData } from "../../helpers";
import { Link } from "react-router-dom";
import "./MessagePage.css"; // Import the custom stylesheet for MessagesPage component
import { API_BASE_URL } from "../../helpers";
import socket from "socket.io-client"; // Import the socket instance

const { jwt } = userData();
const {id } = userData();
const socketInstance = socket(API_BASE_URL); // Use the same socket instance as in App.js

const MessagesPage = () => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set()); // Track online users by their IDs
  const { username } = userData();
  const [lastEventTime, setLastEventTime] = useState(Date.now()); // Track the last event timestamp

  useEffect(() => {
    // Fetch users when the component mounts
    fetchUsers();

    // Socket event listener for UserOnline
    socketInstance.on("UserOnline", (data) => {
      const { userId } = data;
      if ( userId !== null && userId !== id) {
        // Your logic here
        console.log("Received UserOnline event for userId:", userId);

              // Add the userId to the online users set and update last event time
      setOnlineUsers((prevOnlineUsers) => {
        const updatedSet = new Set(prevOnlineUsers);
        updatedSet.add(userId); // Add the userId to the set
        return updatedSet;
      });

      // Update the last event time to the current time
      setLastEventTime(Date.now());

      }

    });

    // Set all statuses to offline if no UserOnline event is received in the last 10 seconds
    const checkForTimeout = setInterval(() => {
      if (Date.now() - lastEventTime > 10000) {
        console.log("No UserOnline event received for the last 10 seconds. Setting all statuses to offline.");

        // Reset online users set (set all users to offline)
        setOnlineUsers(new Set());
      }
    }, 10000); // Check every 10 seconds

    return () => {
      // Cleanup the socket listeners on component unmount
      socketInstance.off("UserOnline");
      socketInstance.off("UserOffline");
      clearInterval(checkForTimeout); // Clear the interval on component unmount
    };
  }, [lastEventTime]); // Re-run the effect when lastEventTime changes

  // Fetch all users except the current one
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
                  <p className="username">
                    {user.username}
                    <span
                      className={`status-dot ${
                        onlineUsers.has(user.id) ? "online" : "offline"
                      }`}
                    ></span>
                    <span className="status-text">
                      {onlineUsers.has(user.id) ? "Online" : "Offline"}
                    </span>
                  </p>
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
