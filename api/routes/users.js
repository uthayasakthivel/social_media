import express from "express";
import { getUser } from "../controllers/user.js";

const router = express.Router();

// router.get("/checking", (req, res) => {
//   res.send("working routes");
// });

router.get("/find/:userId", getUser);

export default router;
