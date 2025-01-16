import { db } from "../dbConnection.js";

// Get all posts with likes and comments count
export const getPosts = (req, res) => {
  console.log("GET request to fetch posts triggered!"); // Log that the route is triggered

  const getPostsQuery = "SELECT * FROM posts ORDER BY created_at DESC";
  db.query(getPostsQuery, (err, results) => {
    if (err) {
      console.error("Error executing query: ", err); // Log the error if it occurs
      return res
        .status(500)
        .json({ message: "Error fetching posts", error: err });
    }

    console.log("Fetched posts: ", results); // Log the results fetched from the DB
    return res.status(200).json(results);
  });
};

// Create a new post
export const createPost = (req, res) => {
  const { user_name, content } = req.body;

  const createPostQuery = `
    INSERT INTO posts (user_name, content)
    VALUES (?, ?)
  `;

  db.query(createPostQuery, [user_name, content], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error creating post", error: err });
    }
    return res.status(200).json({
      message: "Post created successfully",
      postId: result.insertId,
      user_name,
    });
  });
};
