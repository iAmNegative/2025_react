import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../../helpers";
import { userData } from "../../helpers";
import './Posts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import CustomNav from "../CustomNav";


const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [userThumbs, setUserThumbs] = useState({});
  const [newSparkImage, setNewSparkImage] = useState(null);
  const [newSparkCaption, setNewSparkCaption] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const { jwt, id, username } = userData();
  const [showComments, setShowComments] = useState({});
  const [commentInput, setCommentInput] = useState('');
  const [showCommentInput, setShowCommentInput] = useState({});
  const [commentsAdded, setCommentsAdded] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [userLikes, setUserLikes] = useState({}); // Store user's liked posts

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setNewSparkImage(selectedImage);
  };

  const toggleCommentInput = (postId) => {
    setShowCommentInput((prevShowCommentInput) => ({
      ...prevShowCommentInput,
      [postId]: !prevShowCommentInput[postId],
    }));
  };

  const addComment = async (postId) => {
    try {
      const requestBody = {
        data: {
          post: postId,
          userComment: commentInput,
          commentedBy: username,
        },
      };

      await axios.post(`${API_BASE_URL}/api/user-comments`, requestBody, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      setCommentInput('');

      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  function userLikedPost(likedLists) {
    
    return likedLists.some((likedItem) => {
      return likedItem.attributes.likedBy === username;
    });
  }
  
  // Now, userHasLikedPost is true if the logged-in user has liked the post, and false otherwise.
    const userHasLikedPost = userLikedPost(posts.map((post) =>   post.attributes.liked_lists.data).flat());

  
    

  const fetchUserThumbnails = async () => {
    try {
      const users = await Promise.all(posts.map(async (post) => {
        const userId = post.attributes.postCreatedBy.data.id;
        const response = await axios.get(`${API_BASE_URL}/api/users/${userId}?populate=*`);

        const userProfile = response.data.userProfile;
        const thumbnailUrl = userProfile && userProfile.length > 0
          ? userProfile[0].formats.thumbnail.url
          : null;

        return {
          id: userId,
          thumbnailUrl: thumbnailUrl,
        };
      }));

      const userThumbnails = {};
      users.forEach((user) => {
        userThumbnails[user.id] = user.thumbnailUrl;
      });

      setUserThumbs(userThumbnails);
    } catch (error) {
      console.error('Error fetching user thumbnails:', error);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const likedPost = posts.find((post) => post.id === postId);
      if (!likedPost) return;

      const likedByCurrentUser = userLikedPost(likedPost.attributes.liked_lists.data);

      const requestBody = {
        data: {
          post: postId,
          likedBy: username,
        },
      };

      if (likedByCurrentUser) {
        // If the user has already liked the post, unlike it.

        const response =  await axios.get(`${API_BASE_URL}/api/liked-lists?filters[likedBy][$eq]=${username}&populate=post&filters[post][id][$eq]=${postId}`) 


        if(response && response.data.data[0] && response.data.data[0].id){

          await axios.delete(`${API_BASE_URL}/api/liked-lists/${response.data.data[0].id}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          fetchPosts();

        }

      } else {
        // If the user hasn't liked the post, like it.
        await axios.post(`${API_BASE_URL}/api/liked-lists`, requestBody, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setUserLikes((prevUserLikes) => ({
          ...prevUserLikes,
          [postId]: true,
        }));
        setLikeCounts((prevLikeCounts) => ({
          ...prevLikeCounts,
          [postId]: prevLikeCounts[postId] + 1,
        }));
        fetchPosts();

      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const createSpark = async () => {
    if (!newSparkImage || !newSparkCaption) {
      alert('Please select an image and provide a caption.');
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("files", newSparkImage);

      const uploadResponse = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.data && uploadResponse.data[0].id) {
        const imageId = uploadResponse.data[0].id;

        try {
          const requestBody = {
            data: {
              image: imageId,
              caption: newSparkCaption,
              postCreatedBy: id,
            },
          };

          await axios.post(`${API_BASE_URL}/api/posts`, requestBody, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });

          setNewSparkImage(null);
          setNewSparkCaption('');
          setUploadingImage(false);
          fetchPosts();
        } catch (error) {
          console.error("Error igniting spark:", error);
          setUploadingImage(false);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleComments = (postId) => {
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [postId]: !prevShowComments[postId],
    }));
  };

  useEffect(() => {
    fetchUserThumbnails();
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts?populate=*&sort=id:desc`);
      setPosts(response.data.data);

      // Initialize like counts and userLikes based on fetched data
      const initialLikeCounts = {};
      const initialUserLikes = {};
      response.data.data.forEach((post) => {
        initialLikeCounts[post.id] = post.attributes.likesCount || 0;
        if(post.attributes.liked_lists){
          initialUserLikes[post.id] = userLikedPost(post.attributes.liked_lists.data);

        }
      });
      setLikeCounts(initialLikeCounts);
      setUserLikes(initialUserLikes);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div>
       <CustomNav />
      <div className="posts-container">
        <div className="posts-header">
          <h1>Sparks</h1>
        </div>
        <div className="create-spark-button">
          <label className="file-input-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-input"
            />
            <span className="image-icon">📸</span>
          </label>
          <input
            type="text"
            placeholder="Enter caption..."
            value={newSparkCaption}
            onChange={(e) => setNewSparkCaption(e.target.value)}
            className="caption-input"
          />
          <button onClick={createSpark} disabled={uploadingImage} className="ignite-button">
            {uploadingImage ? "Creating..." : "Ignite"}
          </button>
        </div>
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="thumbnail-section">
              <img
                src={userThumbs[post.attributes.postCreatedBy.data.id] || "https://res.cloudinary.com/drzwoxrgj/image/upload/v1693246598/thumbnail_149071_6059a26d10.png"}
                alt="User Thumbnail"
                className="user-thumbnail"
              />
            </div>
            <div className="post-details">
              <div className="post-header">
                <span className="username">
                  {post.attributes.postCreatedBy.data.attributes.username}
                </span>
              </div>
              <img
                src={post.attributes.image.data[0].attributes.formats.medium.url || ""}
                alt="Post"
                className="post-image"
              />
              <div className="post-caption">{post.attributes.caption}</div>
              <div className="post-interactions">
                {/* Like Button with Like Count */}
                <span
                  className={`like-icon${userLikes[post.id] ? ' liked' : ''}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    toggleLike(post.id);
                  }}
                >
                {userLikes[post.id] ? (
                 '⚡'
                ) : (
                  <FontAwesomeIcon icon={faBolt} color="white"  />
                )} {post.attributes.liked_lists.data.length}
                </span>
                
                {/* Comment Icon */}

                <span
                  className="comment-icon"
                  onClick={() => toggleComments(post.id)}
                  style={{ cursor: "pointer" }}
                >
                  💬 {post.attributes.comments.data.length}
                </span>
                {/* Comment Button */}
                <span
                  className="comment-button"
                  onClick={() => toggleCommentInput(post.id)}
                  style={{ cursor: "pointer" }}
                >
                  +
                </span>
              </div>
              {showComments[post.id] && (
                <div className="post-comments">
                  {post.attributes.comments.data
                    .sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt))
                    .map((comment) => (
                      <div key={comment.id} className="comment">
                        <span className="comment-text">{comment.attributes.userComment}</span>
                        <div className="comment-details">
                          <span className="commented-by">{comment.attributes.commentedBy}</span>
                          <span className="comment-date">
                            {new Date(comment.attributes.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {showCommentInput[post.id] && (
                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="comment-input-field"
                  />
                  <button
                    onClick={() => addComment(post.id)}
                    className="comment-add-button"
                  >
                    Add
                  </button>
                </div>
              )}
              <div className='post-date'>
                {new Date(post.attributes.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <></>
    </div>
  );
};

export default Posts;
