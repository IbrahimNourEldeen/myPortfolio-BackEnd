const express = require('express');
const { getAllUsers, getUser, addUser,updateUser, deleteUser, deleteAllUsers, register, login } = require('../controllers/users.controller');


const router = express.Router();

router.route('/')
    .get(getAllUsers)
    .post(addUser)
    .delete(deleteAllUsers)

router.route('/:userId')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser)

router.post('/register',register)    
router.post('/login',login)    


module.exports = router;