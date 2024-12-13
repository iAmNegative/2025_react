import React, { useState, useEffect } from "react";
import CustomNav from "../CustomNav";
import axios from "axios";
import { userData } from "../../helpers";
import "./Profile.css"; // Import your custom stylesheet for Profile component
import { API_BASE_URL } from "../../helpers";
import { SPRING_BASE_URL } from "../../helpers";


import { Link } from "react-router-dom";

const { jwt } = userData();

const Profile = () => {
  const { id, username, email } = userData();
  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [profileData, setProfileData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {

      const requestBody = {
        username: username,
        jwt: jwt,
      
      };


      const response = await axios.post(`${SPRING_BASE_URL}/get/user/details`,requestBody

      );
      if (response && response.data) {
        setProfileData(response.data);
        setEditedProfile({
          firstName: response.data.firstName || "",
          middleName: response.data.middleName || "",
          lastName: response.data.lastName || "",
        });
        setProfileImage(response.data.userProfileSmallUrl)
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProfile((prevEditedProfile) => ({
      ...prevEditedProfile,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/users/${id}`, editedProfile,
      
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
      
      );
      setEditMode(false);
      fetchProfileData();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const handleImageUpload = async () => {
    try {

      setUploadingImage(true);
      const formData = new FormData();
      formData.append("files", selectedImage);
      
      const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.data && response.data[0].id) {
        // Successfully uploaded the image, you can now associate the image ID with the user's profile
        const imageId = response.data[0].id;
        console.log(imageId);

        try {

          const requestBody = {


              "userProfile": imageId 
            
                  
          };

          await axios.put(`${API_BASE_URL}/api/users/${id}`,requestBody,{
            headers: {
              Authorization: `Bearer ${jwt}`
            },
          }

       ) } catch (error) {
        console.error("Error updating profile:", error);

        }
        setUploadingImage(false);
        
        // Call your Strapi update API here to associate the image ID with the user's profile
        
        // Once the image is associated, you can fetch the updated profile data
        fetchProfileData();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadingImage(false);
    }
  };
  

  return (
    <div>
      <CustomNav />
      <div className="profile-image">
        <label htmlFor="profileImageInput">
        <img
         src={selectedImage ? URL.createObjectURL(selectedImage) : profileImage || "https://res.cloudinary.com/drzwoxrgj/image/upload/v1693137223/no_preview_4_b0cb973ff6.png"}
         alt="Profile"
         className="profile-image"
        />

          {/* <img
            src={profileImage || "https://res.cloudinary.com/drzwoxrgj/image/upload/v1693137223/no_preview_4_b0cb973ff6.png"}
            alt="Profile"
            className="profile-image"
          /> */}
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            onChange={(event) => setSelectedImage(event.target.files[0])}
            style={{ display: "none" }}
          />
        </label>
        {selectedImage && (
          <div className="upload-container">
            {uploadingImage ? (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <button className="profile-upload-btn" onClick={handleImageUpload}>
                Upload
              </button>
            )}
          </div>
        )}
      </div>


      <div className="profile">
        <h2 className="profile-header">Profile Information</h2>
        <div className="profile-details">
          <p>
            <strong>Username:</strong> {profileData.username}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
          <p>
            <strong>First Name:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="firstName"
                value={editedProfile.firstName}
                onChange={handleInputChange}
              />
            ) : (
              profileData.firstName || "N/A"
            )}
          </p>
          <p>
            <strong>Middle Name (optional):</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="middleName"
                value={editedProfile.middleName}
                onChange={handleInputChange}
              />
            ) : (
              profileData.middleName || "N/A"
            )}
          </p>
          <p>
            <strong>Last Name:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name="lastName"
                value={editedProfile.lastName}
                onChange={handleInputChange}
              />
            ) : (
              profileData.lastName || "N/A"
            )}
          </p>
          <p>
            {editMode ? (
              <button className="profile-submit-btn" onClick={handleFormSubmit}>
                Save Changes
              </button>
            ) : (
              <Link className="profile-edit-btn" onClick={handleEditClick}>
                Edit Profile
              </Link>
              
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
