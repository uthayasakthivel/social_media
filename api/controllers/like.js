import { db } from "../dbConnection.js";

// Like a post
export const likePost = (req, res) => {
  const { postId, userName } = req.body;

  const checkIfLikedQuery = `
      SELECT * FROM likes WHERE post_id = ? AND user_name = ?
    `;
  db.query(checkIfLikedQuery, [postId, userName], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error checking like status", error: err });

    // if (results.length > 0) {
    //   return res.status(400).json({ message: "Post already liked" });
    // }

    const insertLikeQuery = `
        INSERT INTO likes (post_id, user_name) VALUES (?, ?)
      `;
    db.query(insertLikeQuery, [postId, userName], (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error liking post", error: err });

      // Update the likes_count in the posts table
      const updateLikesCountQuery = `
          UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?
        `;
      db.query(updateLikesCountQuery, [postId], (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error updating like count", error: err });
        }
        return res.status(200).json({ message: "Post liked successfully" });
      });
    });
  });
};

// Unlike a post
export const unlikePost = (req, res) => {
  const { postId, userName } = req.body;
  const deleteLikeQuery = `
    DELETE FROM likes WHERE post_id = ? AND user_name = ?
  `;
  db.query(deleteLikeQuery, [postId, userName], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error unliking post", error: err });

    // Update the number of likes in the posts table
    const updateLikesCountQuery = `
      UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?
    `;
    db.query(updateLikesCountQuery, [postId], (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error updating like count", error: err });
      return res.status(200).json({ message: "Post unliked successfully" });
    });
  });
};
