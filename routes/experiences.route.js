const express = require('express');
const { addExperience, deleteExperience } = require('../controllers/experiences.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();


router.route('/')
.post(verifyToken, allowedToAdmin, addExperience)


router.delete('/:expIndex', verifyToken, allowedToAdmin, deleteExperience)

module.exports = router