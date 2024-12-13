import React, { useState, useEffect } from "react";
import CustomNav from "../CustomNav";
import axios from "axios";
import { userData } from "../../helpers";
import { Link } from "react-router-dom";
import "./MessagePage.css"; // Import the custom stylesheet for MessagesPage component
import { API_BASE_URL } from "../../helpers";


const { jwt } = userData();

const MessagesPage = () => {
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const { username } = userData();
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetchUsers();
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
                </div>
                <Link to={`/view-messages/${user.id}`}>
                  <button className="view-button">View Messages</button>
                </Link>
                {/* <Link to={`/video-chat/${user.id}`}>
                  <button className="view-button">Video call</button>
                  
                </Link> */}
              </li>
            ))}
          </ul>
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
