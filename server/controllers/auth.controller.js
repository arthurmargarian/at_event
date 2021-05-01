const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const config = require('../config/db');


module.exports.sign_up_post = (req, res, next) => {
  let newUser = new User({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    pic_url: req.body.pic_url,
    password: req.body.password,
    is_social: req.body.isSocial
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
          user: user
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

module.exports.by_email_get = (req, res, next) => {
  const email = req.query.email;
  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        model: null,
        status: 10
      });
    } else {
      return res.json({
        success: true,
        model: user,
        status: 1
      });
    }
  });
};

module.exports.profile_get = (req, res, next) => {
  res.json({user: req.user})
}
