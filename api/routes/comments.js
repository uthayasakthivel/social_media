import express from "express";
import { addComment, getComments } from "../controllers/comment.js";

const router = express.Router();

// Add a comment
router.post("/", addComment);

// Get all comments for a specific post
router.get("/:postId", getComments);

export default router;
