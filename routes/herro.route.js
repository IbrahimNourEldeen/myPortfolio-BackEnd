const express = require('express');
const { addHerro, deleteHerro } = require('../controllers/herro.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();

router.route('/')
    .post( verifyToken, allowedToAdmin,addHerro)
    .delete(verifyToken, allowedToAdmin, deleteHerro)

module.exports = router