import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
// import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Cloudinary upload failed', details: error });
            }
            res.status(200).json({ url: result.secure_url });
        }).end(file.buffer);
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

export default router;