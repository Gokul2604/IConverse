const express = require('express');
const { accessChat, fetchChats, createGroup, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroup);
router.route('/rename').put(protect, renameGroup);
router.route('/removefromgroup').put(protect, removeFromGroup);
router.route('/addtogroup').put(protect, addToGroup);

module.exports = router;