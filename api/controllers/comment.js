import { db } from "../dbConnection.js";

// Add a comment
export const addComment = (req, res) => {
  const { post_id, user_name, content } = req.body;

  if (!post_id || !user_name || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `
    INSERT INTO comments (post_id, user_name, content, created_at) 
    VALUES (?, ?, ?, NOW())
  `;

  db.query(query, [post_id, user_name, content], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(201).json({ message: "Comment added successfully." });
  });
};

// Get comments for a specific post
export const getComments = (req, res) => {
  const { postId } = req.params;

  const query = `
    SELECT id, user_name, content, created_at 
    FROM comments 
    WHERE post_id = ? 
    ORDER BY created_at DESC
  `;

  db.query(query, [postId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error.", error: err });
    }
    res.status(200).json(results);
  });
};
