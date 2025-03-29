const express = require('express');
const { getAllUsers, getUser, addUser,updateUser, deleteUser, deleteAllUsers, register, login } = require('../controllers/users.controller');

const verifyToken = require('../middleware/verifyToken')
const allowedToAdmin = require('../middleware/allowedToAdmin')

const router = express.Router();

router.route('/')
    .get(verifyToken, allowedToAdmin, getAllUsers)
    .post(verifyToken, allowedToAdmin, addUser)
    .delete(verifyToken, allowedToAdmin, deleteAllUsers)


router.route('/:userId')
    .get(verifyToken, allowedToAdmin, getUser)
    .put(verifyToken, allowedToAdmin, updateUser)
    .delete(verifyToken, allowedToAdmin, deleteUser)

router.post('/register',register)    
router.post('/login',login)    


module.exports = router;