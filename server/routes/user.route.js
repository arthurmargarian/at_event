const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router.get('/getUserById', UserController.get_user_by_id);

module.exports = router;
