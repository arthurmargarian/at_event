const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

const AuthControllers = require('../controllers/auth');
const User = require('../models/user');


router.post('/register', AuthControllers.sign_up_post);
router.post('/login', AuthControllers.sign_in_post);
router.post('/authenticate', AuthControllers.authenticate_post);
router.get('/profile', AuthControllers.profile_get);


module.exports = router;
