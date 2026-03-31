import Document from "../models/Document.js";
// Helper for Role Ranking

export const createDocument = async (req, res) => {
  try {
    const { title, content, requiredRole } = req.body;

    const newDoc = await Document.create({
      title: title || "Untitled",
      content: content || "",
      requiredRole: requiredRole || "viewer",
      owner: req.user.id,
    });

    // Return data matching your DocData interface
    res.status(201).json({
      ...newDoc._doc,
      userRole: "owner", // Creator is always the owner
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    let userRole = "viewer";
    if (doc.owner.toString() === req.user.id) {
      userRole = "owner";
    } else if (req.user.role === "admin" || req.user.role === "editor") {
      userRole = req.user.role;
    }

    res.status(200).json({
      ...doc._doc,
      userRole, // FE uses this to show/hide 'Save' buttons or 'Settings'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from the URL parameter

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find all documents where the owner matches the userId
    const docs = await Document.find({ owner: userId }).sort({ updatedAt: -1 });

    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    // Only show documents the user is allowed to see
    const userLevel = ROLE_RANK.indexOf(req.user.role);

    // Find docs where: user is owner OR user's rank >= doc's required rank
    const docs = await Document.find({
      $or: [
        { owner: req.user.id },
        { requiredRole: { $in: ROLE_RANK.slice(0, userLevel + 1) } },
      ],
    }).sort({ updatedAt: -1 });

    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });

    // Only Owner or 'editor/admin' can update
    const isOwner = doc.owner.toString() === req.user.id;
    const canEdit = ROLE_RANK.indexOf(req.user.role) >= 1; // 1 is 'editor'

    if (!isOwner && !canEdit) {
      return res.status(403).json({ message: "No edit permissions" });
    }

    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModified: Date.now() },
      { new: true }
    );
    res.status(200).json(updatedDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Replaces your 'verifyDocumentAccess' with Role Verification
export const verifyDocumentAccess = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const isOwner = doc.owner.toString() === req.user.id;
    const userLevel = ROLE_RANK.indexOf(req.user.role);
    const requiredLevel = ROLE_RANK.indexOf(doc.requiredRole);

    if (isOwner || userLevel >= requiredLevel) {
      return res.status(200).json({ authorized: true, doc });
    } else {
      return res.status(403).json({
        authorized: false,
        message: `This document is restricted to ${doc.requiredRole}s.`,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
