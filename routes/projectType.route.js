const express = require('express');
const { getAllProjectTypes } = require('../controllers/projectType.controller');

const router = express.Router();

router.get('/', getAllProjectTypes);

module.exports = router;
