const express = require('express');
const { addOrUpdateSocial, getSocial } = require('../controllers/social.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();

router.post('/', verifyToken, allowedToAdmin, addOrUpdateSocial);
router.get('/:userId', getSocial);

module.exports = router;