const express = require('express');
const { addOrUpdateHero, getHero } = require('../controllers/hero.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();

router.post('/', verifyToken, allowedToAdmin, addOrUpdateHero);
router.get('/:userId', getHero);

module.exports = router;
