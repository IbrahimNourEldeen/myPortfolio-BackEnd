const express = require('express');
const { addEducation,deleteEducation } = require('../controllers/education.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();


router.route('/')
.post(verifyToken, allowedToAdmin, addEducation)


router.delete('/:eduIndex', verifyToken, allowedToAdmin, deleteEducation)

module.exports = router