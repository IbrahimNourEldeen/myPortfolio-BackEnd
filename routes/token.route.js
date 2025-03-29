const express=require('express');
const router = express.Router();
const refreshToken = require('../controllers/refreshToken.controller')

router.route('/refresh')
    .post(refreshToken)

module.exports=router