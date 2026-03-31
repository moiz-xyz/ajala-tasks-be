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

export const verifyDocumentAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body; // Code sent from FE input

    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // If it's not private, grant access immediately
    if (!doc.isPrivate) {
      return res.status(200).json({ authorized: true, doc });
    }

    // Check if the provided code matches
    if (doc.accessCode === code) {
      return res
        .status(200)
        .json({ authorized: true, message: "Access granted", doc });
    } else {
      return res
        .status(401)
        .json({ authorized: false, message: "Incorrect code" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
