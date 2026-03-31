import express from "express";
import {
  createDocument,
  getDocuments,
  updateDocument,
  verifyDocumentAccess,
} from "../contollers/docController.js";

const router = express.Router();

router.post("/", createDocument); // Create
router.get("/", getDocuments); // List all
router.put("/:id", updateDocument); // Update/Rename/Save content
router.post("/:id/verify", verifyDocumentAccess);

export default router;
