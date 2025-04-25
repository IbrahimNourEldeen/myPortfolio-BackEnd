const express = require('express');
const { addTechSkill, addNonTechSkill, deleteSkill } = require('../controllers/skills.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();


router.route('/tech')
.post(verifyToken, allowedToAdmin, addTechSkill)

router.route('/non-tech')
.post(verifyToken, allowedToAdmin, addNonTechSkill)

router.delete('/:type/:skillIndex', verifyToken, allowedToAdmin, deleteSkill)

module.exports = router