import express from "express";
import { likePost, unlikePost } from "../controllers/like.js";

const router = express.Router();

// Route to like a post
router.post("/like", likePost);

// Route to unlike a post
router.post("/unlike", unlikePost);

export default router;
