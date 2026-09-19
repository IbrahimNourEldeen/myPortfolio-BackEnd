const express = require('express');
const { getAllSkillTypes } = require('../controllers/skillType.controller');

const router = express.Router();

router.get('/', getAllSkillTypes);

module.exports = router;
