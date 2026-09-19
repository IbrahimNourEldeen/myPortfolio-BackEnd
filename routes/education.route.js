const express = require('express');
const { addEducation, getEducation, updateEducation, deleteEducation } = require('../controllers/education.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();

router.route('/')
    .get(getEducation)
    .post(verifyToken, allowedToAdmin, addEducation);

router.route('/:eduId')
    .put(verifyToken, allowedToAdmin, updateEducation)
    .delete(verifyToken, allowedToAdmin, deleteEducation);

module.exports = router;