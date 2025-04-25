const express = require('express');
const { getUser, updateUser, deleteUser, register, login, logOut } = require('../controllers/users.controller');

const verifyToken = require('../middleware/verifyToken')
const allowedToAdmin = require('../middleware/allowedToAdmin')

const router = express.Router();

router.route('/:userId')
    .get(verifyToken, allowedToAdmin, getUser)
    .put(verifyToken, allowedToAdmin, updateUser)
    .delete(verifyToken, allowedToAdmin, deleteUser)

router.post('/register', register)
router.post('/login', login)
router.post('/logout', verifyToken, logOut)


module.exports = router;