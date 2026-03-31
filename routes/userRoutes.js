import express from "express";
import { registerUser } from "../contollers/userController";

const router = express.Router();

// Define the POST route for registration
router.post("/login", registerUser);

export default router;
