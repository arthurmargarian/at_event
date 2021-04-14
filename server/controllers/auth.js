const User = require('../models/user');


module.exports.sign_up_post = (req, res, next) => {
  let newUser = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
  });
  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({success: false, msg: 'Failed register'})
    } else {
      res.json({success: true, msg: 'User registered'})
    }
  })
}


module.exports.sign_in_post = (req, res, next) => {
  res.send('sign_in_post')
}

module.exports.authenticate_post = (req, res, next) => {
  res.send('authenticate_post')
}

module.exports.profile_get = (req, res, next) => {
  res.send('profile_get')
}
