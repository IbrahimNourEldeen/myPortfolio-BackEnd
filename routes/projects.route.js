const express = require('express');
const router = express.Router();
const { addProject, deleteProject } = require('../controllers/projects.controller')
const multer = require('multer');
const path = require('path');
const verifyToken = require('../middleware/verifyToken')
const allowedToAdmin = require('../middleware/allowedToAdmin')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fs = require('fs');
        const uploadPath = path.join(__dirname, '..', 'uploads', 'projects');

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeType = file.mimetype;

        if (!allowedExtensions.includes(ext) || !mimeType.startsWith('image/')) {
            cb(new Error('Only JPG, PNG, and JPEG are allowed.'));
        } else {
            cb(null, true);
        }
    }
});


router.route('/add-project')
    .post(verifyToken, allowedToAdmin, upload.array('poster', 20), addProject)

router.delete('/delete-project/:projectId', verifyToken, allowedToAdmin, deleteProject);



module.exports=router;
