import express from "express";
// import {
//   createDocument,
//   getDocuments,
//   updateDocument,
//   verifyDocumentAccess,
// } from "../controllers/docController.js";
import { protect } from "../middlwares/auth.js";
import {
  verifyDocumentAccess,
  createDocument,
  getDocuments,
  updateDocument,
} from "../contollers/docController.js";

const router = express.Router();

// All these routes now require a valid token
router.post("/", protect, createDocument);
router.get("/", protect, getDocuments);
router.put("/:id", protect, updateDocument);
router.get("/:id/verify", protect, verifyDocumentAccess);

export default router;
