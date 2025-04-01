const express = require('express');
const router = express.Router();
const updateImage = require('../controllers/avatar.controller');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const uploadDir = path.join(__dirname, '../uploads/avatar');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const distStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = `user-${Date.now()}${ext}`;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split('/')[0];
    if (fileType === 'image') {
        cb(null, true);
    } else {
        cb(new Error('File must be an image'), false);
    }
};

const upload = multer({
    storage: distStorage,
    fileFilter: fileFilter,
}).single('avatar');

const handleFileUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ status: 'fail', message: err.message });
        }
        next();
    });
};

router.route('/upload/img')
    .put(verifyToken, allowedToAdmin, handleFileUpload, updateImage);

module.exports = router;
