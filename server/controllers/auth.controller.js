const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const config = require('../config/db');


module.exports.sign_up_post = (req, res) => {
  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    fullName: `${req.body.firstName} ${req.body.lastName}`,
    email: req.body.email,
    photoUrl: req.body.photoUrl,
    password: req.body.password,
    isSocial: req.body.isSocial,
    contactNumber: req.body.contactNumber ? req.body.contactNumber : '',
    contactEmail: req.body.contactEmail ? req.body.contactEmail : req.body.email,
    orgIds : req.body.orgIds ? req.body.orgIds : [],
    activeOrgId : req.body.activeOrgId ? req.body.activeOrgId : 0,
    eventIds: req.body.eventIds ? req.body.eventIds : [],
    followerIds: req.body.followerIds ? req.body.followerIds : [],
    interestedTypeIds: req.body.interestedTypeIds ? req.body.interestedTypeIds : [],
    followingUserIds: req.body.followingUserIds ? req.body.followingUserIds : [],
    followingEventIds: req.body.followingEventIds ? req.body.followingEventIds : [],
    followingOrgIds: req.body.followingOrgIds ? req.body.followingOrgIds : []
  });
  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({success: false, status: 1, msg: 'Failed register'})
    } else {
      res.json({success: true,  status: 10, msg: 'User registered', user: user})
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
        status: 10
      });
    }
  });
};

module.exports.profile_get = (req, res, next) => {
  res.json({user: req.user})
}
