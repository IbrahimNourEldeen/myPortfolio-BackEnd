const express = require('express');
const { addSkill, getSkills, updateSkill, deleteSkill } = require('../controllers/skills.controller');
const verifyToken = require('../middleware/verifyToken');
const allowedToAdmin = require('../middleware/allowedToAdmin');

const router = express.Router();

router.route('/')
    .get(getSkills)
    .post(verifyToken, allowedToAdmin, addSkill);

router.route('/:skillId')
    .put(verifyToken, allowedToAdmin, updateSkill)
    .delete(verifyToken, allowedToAdmin, deleteSkill);

module.exports = router;