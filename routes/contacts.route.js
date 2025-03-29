const express = require('express')
const { getAllMessages, addMessage, getMessage, deleteMessage, deleteAllMessages } = require('../controllers/contacts.controller')

const verifyToken = require('../middleware/verifyToken')
const allowedToAdmin = require('../middleware/allowedToAdmin')

const router = express.Router();


router.route('/')
    .get(verifyToken, allowedToAdmin, getAllMessages)
    .post(addMessage)
    .delete(verifyToken, allowedToAdmin, deleteAllMessages)

router.route('/:messageId')
    .get(verifyToken, allowedToAdmin, getMessage)
    .delete(verifyToken, allowedToAdmin, deleteMessage)


module.exports = router;