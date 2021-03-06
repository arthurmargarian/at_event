const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');

router.get('/getUserById', UserController.get_user_by_id);
router.get('/getUsersById', UserController.get_users_by_id);
router.put('/updateUserById', UserController.put_update_user_by_id);
router.put('/followToUser', UserController.put_follow_to_user);
router.put('/unFollowToUser', UserController.put_unfollow_to_user);
router.post('/updateUserInterests', UserController.post_update_user_interests);

module.exports = router;
