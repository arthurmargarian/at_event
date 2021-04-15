const express = require('express');
const router = express.Router();
const passport = require('passport');

const AuthControllers = require('../controllers/auth');


router.post('/register', AuthControllers.sign_up_post);
router.post('/login', AuthControllers.login_post);
router.get('/profile', passport.authenticate('jwt', {session: false}), AuthControllers.profile_get);


module.exports = router;
