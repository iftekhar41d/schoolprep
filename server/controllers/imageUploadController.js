import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const imageUploadRouter = express.Router();

// Ensure 'public/user_upload' directory exists
const uploadDir = path.join(process.cwd(), 'public', 'user_upload');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Store uploaded files in 'public/user_upload'
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Image upload endpoint
imageUploadRouter.post('/profileimage/upload', upload.single('profileImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully', filePath: `/user_upload/${req.file.filename}` });
    console.log('file uploaded successfully');
});

export default imageUploadRouter;