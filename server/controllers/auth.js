
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/db');


module.exports.sign_up_post = (req, res, next) => {
  let newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  });
  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({success: false, msg: 'Failed register', user: user})
    } else {
      res.json({success: true, msg: 'User registered'})
    }
  })
}

module.exports.login_post = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        msg: 'User Not Found',
        status: 1
      });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 / 7 //1 week
        });
        res.json({
          success: true,
          status: 10,
          token: `Bearer ${token}`,
          user: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          }
        });
      } else {
        res.json({
          success: false,
          msg: 'Wrong Password',
          status: 2
        })
      }
    });
  });
};

module.exports.profile_get = (req, res, next) => {
  res.json({user: req.user})
}
