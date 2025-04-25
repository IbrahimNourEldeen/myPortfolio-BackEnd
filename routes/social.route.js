const express = require('express');
const { addURL, deleteURL } = require('../controllers/social.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();

router.route('/')
    .post( verifyToken, allowedToAdmin,addURL)
    .delete(verifyToken, allowedToAdmin, deleteURL)

module.exports = router