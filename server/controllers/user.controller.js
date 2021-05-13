const User = require('../models/user.model');

module.exports.get_user_by_id = (req, res) => {
  const userId = req.query.id;
  User.getUserById(userId, (err, user) => {
    if (err) throw err;
    if (user) {
      user.password = null;
      res.json({
        success: true,
        model: user,
        status: 10
      })
    } else {
      res.json({
        success: false,
        model: null,
        status: 1
      })
    }
  })
}
