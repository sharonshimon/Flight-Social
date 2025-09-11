const express = require('express');
const router = express.Router();
const chatMessageController = require('../controllers/chatMessageController');

router.get('/', chatMessageController.getAllMessages);
router.post('/', chatMessageController.createMessage);

module.exports = router;