const express = require('express');
const { addExperience, getExperiences, updateExperience, deleteExperience } = require('../controllers/experiences.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();

router.route('/')
    .get(getExperiences)
    .post(verifyToken, allowedToAdmin, addExperience);

router.route('/:expId')
    .put(verifyToken, allowedToAdmin, updateExperience)
    .delete(verifyToken, allowedToAdmin, deleteExperience);

module.exports = router;