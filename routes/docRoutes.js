import express from "express";
import {
  createDocument,
  getDocuments,
  updateDocument,
} from "../contollers/docController.js";

const router = express.Router();

router.post("/", createDocument); // Create
router.get("/", getDocuments); // List all
router.put("/:id", updateDocument); // Update/Rename/Save content

export default router;
