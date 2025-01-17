import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState(""); // Define content state
  const [newComment, setNewComment] = useState({});
  const [comments, setComments] = useState({}); // Store comments for each post by id
  // const { username } = JSON.parse(localStorage.getItem("user"));
  const [likedPosts, setLikedPosts] = useState([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.username || null;

  // Fetch all posts and liked posts for the current user
  useEffect(() => {
    fetchPosts();
    // fetchLikedPosts();
  }, [username]); // Only fetch posts and liked posts when the username changes

  const fetchPosts = async () => {
    try {
      const postsResponse = await axios.get(`http://localhost:8800/api/posts`);
      setPosts(postsResponse.data);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  // const fetchLikedPosts = async () => {
  //   try {
  //     const likedPostsResponse = await axios.get(
  //       `http://localhost:8800/api/likes/${username}`
  //     );
  //     const likedPostIds = likedPostsResponse.data.map((like) => like.post_id);
  //     setLikedPosts(likedPostIds);
  //   } catch (error) {
  //     console.log("Error fetching liked posts:", error);
  //   }
  // };

  // Fetch comments for posts
  useEffect(() => {
    if (posts.length > 0) {
      const fetchComments = async () => {
        try {
          const commentsPromises = posts.map((post) =>
            axios.get(`http://localhost:8800/api/comments/${post.id}`)
          );
          const commentsResponses = await Promise.all(commentsPromises);
          const commentsData = {};
          commentsResponses.forEach((response, index) => {
            commentsData[posts[index].id] = response.data;
          });
          setComments(commentsData);
        } catch (error) {
          console.log("Error fetching comments:", error);
        }
      };
      fetchComments(); // Fetch comments only if posts are fetched
    }
  }, [posts]); // This effect only runs after posts are fetched

  // Handle creating a new post
  const handleCreatePost = () => {
    if (content) {
      axios
        .post(`http://localhost:8800/api/posts`, {
          content,
          user_name: username,
        })
        .then((response) => {
          setContent(""); // Reset content field
          fetchPosts(); // Fetch posts again after creating a new one
        })
        .catch((error) => console.log(error));
    }
  };

  // Handle liking a post
  const handleLike = (postId) => {
    axios
      .post(`http://localhost:8800/api/likes/like`, {
        postId,
        userName: username,
      })
      .then((response) => {
        setLikedPosts([...likedPosts, postId]);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likes_count: post.likes_count + 1 }
              : post
          )
        );
      })
      .catch((error) => console.log(error));
  };

  // Handle unliking a post
  const handleUnlike = (postId) => {
    // Check if the post has been liked by the user
    // Send API request to unlike the post
    axios
      .post(`http://localhost:8800/api/likes/unlike`, {
        postId,
        userName: username,
      })
      .then((response) => {
        // Update the UI by removing the post from likedPosts
        setLikedPosts(likedPosts.filter((id) => id !== postId));

        // Update the likes_count for the post in the state
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, likes_count: post.likes_count - 1 }
              : post
          )
        );
      })
      .catch((error) => {
        console.error("Error unliking the post:", error);
      });
  };

  // Handle adding a comment
  const handleAddComment = (postId) => {
    if (newComment[postId]) {
      axios
        .post(`http://localhost:8800/api/comments`, {
          content: newComment[postId],
          post_id: postId,
          user_name: username,
        })
        .then((response) => {
          setNewComment((prev) => ({
            ...prev,
            [postId]: "", // Reset comment input field for the post
          }));

          // Add the new comment to the state for the specific post
          setComments((prevComments) => ({
            ...prevComments,
            [postId]: [
              ...(prevComments[postId] || []),
              {
                id: response.data.id,
                user_name: username,
                content: newComment[postId],
              },
            ],
          }));
        })
        .catch((error) => console.log(error));
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Logout Button */}
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleLogout}
        style={{ marginBottom: "20px" }}
      >
        Logout
      </Button>

      {/* Create a New Post */}
      <Typography variant="h4" gutterBottom>
        Create a New Post
      </Typography>
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)} // Handle content input
        label="What's on your mind?"
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        style={{ marginBottom: "10px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreatePost}
        fullWidth
      >
        Post
      </Button>

      {/* Display All Posts */}
      <Typography
        variant="h5"
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        All Posts
      </Typography>
      <List>
        {posts.map((post) => {
          const isLiked = likedPosts.includes(post.id);

          return (
            <ListItem key={post.id} style={{ marginBottom: "20px" }}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  {/* Post Content */}
                  <Typography variant="h6">
                    <strong>
                      {post.user_name ? post.user_name : "Anonymous"}
                    </strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {post.content}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Likes: {post.likes_count || 0}
                  </Typography>

                  {/* Like/Unlike Buttons */}
                  <div style={{ marginTop: "10px" }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleLike(post.id)}
                    >
                      {isLiked ? "Liked" : "Like"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleUnlike(post.id)}
                      style={{ marginLeft: "10px" }}
                      disabled={post.likes_count === 0} // Disable if no likes
                    >
                      Unlike
                    </Button>
                  </div>

                  {/* Divider for separating post content and comments */}
                  <Divider style={{ margin: "10px 0" }} />

                  {/* Comments Section */}
                  <div>
                    <Typography variant="h6">Comments</Typography>

                    {/* Display Comments */}
                    <List>
                      {(comments[post.id] || []).map((comment) => (
                        <ListItem key={comment.id}>
                          <Typography variant="body2">
                            <strong>{comment.user_name}:</strong>{" "}
                            {comment.content}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>

                    {/* Add a Comment */}
                    <TextField
                      value={newComment[post.id] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      label="Add a comment"
                      fullWidth
                      variant="outlined"
                      style={{ marginTop: "10px" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddComment(post.id)}
                      style={{ marginTop: "10px" }}
                    >
                      Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Posts;
