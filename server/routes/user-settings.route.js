const express = require('express');
const router = express.Router();

const UserControllers = require('../controllers/user-settings.controller');


router.post('', UserControllers.user_setting_post);
router.get('', UserControllers.user_setting_get);


module.exports = router;
