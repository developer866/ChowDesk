import express from "express";
import { upload, uploadToCloudinary } from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const url = await uploadToCloudinary(req.file.buffer);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: "Image upload failed", error: err.message });
  }
});

export default router;