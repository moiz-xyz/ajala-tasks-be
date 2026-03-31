import Document from "../models/Document.js";

export const createDocument = async (req, res) => {
  try {
    const newDoc = await Document.create({
      title: req.body.title || "Untitled",
    });
    res.status(201).json(newDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ updatedAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updatedDoc = await Document.findByIdAndUpdate(
      req.params.id,
      { title, content, lastModified: Date.now() },
      { new: true }
    );
    res.status(200).json(updatedDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
