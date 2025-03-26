const express = require('express')
const { getAllMessages, addMessage, getMessage, deleteMessage, deleteAllMessages } = require('../controllers/contacts.controller')

const router = express.Router();


router.route('/')
    .get(getAllMessages)
    .post(addMessage)
    .delete(deleteAllMessages)

router.route('/:messageId')
    .get(getMessage)
    .delete(deleteMessage)    


module.exports = router;