const express = require('express');
const router = express.Router();
const { updateFile, downloadCV } = require('../controllers/cv.controller');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const verifyToken = require('../middleware/verifyToken')
const allowedToAdmin = require('../middleware/allowedToAdmin')

const uploadDir = path.join(__dirname, '../uploads/cv');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const distStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/cv'); 
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); 
        const fileName = `user-${Date.now()}${ext}`;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('File must be a PDF'), false);
    }
};

const upload = multer({
    storage: distStorage,
    fileFilter: fileFilter,
});

router.route('/upload/file')
    .put(verifyToken, allowedToAdmin, upload.single('CVFile'), updateFile)

router.route('/download/:id')
    .get(downloadCV)    

module.exports = router;
