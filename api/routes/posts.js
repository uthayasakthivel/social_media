import express from "express";
import { getPosts, createPost } from "../controllers/post.js";

const router = express.Router();

// Route to get all posts
router.get("/", getPosts);

// Route to create a new post
router.post("/", createPost);

export default router;
