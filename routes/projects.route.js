const express = require('express');
const { addProject, getProjects, updateProject, deleteProject, deleteProjectImage } = require('../controllers/projects.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads/projects');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = `project-${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
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
    storage: storage,
    fileFilter: fileFilter,
});

const router = express.Router();

router.route('/')
    .get(getProjects)
    .post(verifyToken, allowedToAdmin, upload.array('poster'), addProject);

router.route('/:projectId')
    .put(verifyToken, allowedToAdmin, upload.array('poster'), updateProject)
    .delete(verifyToken, allowedToAdmin, deleteProject);

router.route('/:projectId/images/:imageIndex')
    .delete(verifyToken, allowedToAdmin, deleteProjectImage);

module.exports = router;
