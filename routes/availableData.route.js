const express = require('express');

const {getNaturalData, getCoreProfile, syncPortfolioData} = require('../controllers/availableData.controller')

const router = express.Router();


router.get('/natural-data',getNaturalData);
router.get('/core-profile', getCoreProfile);
router.post('/sync', syncPortfolioData);

module.exports= router;