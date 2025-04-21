const express = require('express');

const {getNaturalData} = require('../controllers/availableData.controller')

const router = express.Router();


router.get('/natural-data',getNaturalData);

module.exports= router;