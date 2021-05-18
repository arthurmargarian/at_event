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
        status: 0
      })
    }
  })
}

module.exports.get_users_by_id = (req, res) => {
  const userIds = req.query.userIds.split(',');
  User.getUsersById(userIds, (err, users) => {
    if (err) throw err;
    if (users) {
      users.password = null;
      res.json({
        success: true,
        model: users,
        status: 10
      })
    } else {
      res.json({
        success: false,
        model: null,
        status: 0
      })
    }
  })

}

module.exports.put_follow_to_user = (req, res) => {
  if (req.body.followerId && req.body.followingId) {
    User.addFollowing(req.body.followerId, req.body.followingId, (err) => {
      if (err) throw err;
    })
    User.addFollower(req.body.followerId, req.body.followingId, (err) => {
      if (err) throw err;
      res.json({
        success: true,
        status: 10
      })
    })
  }
}

module.exports.put_unfollow_to_user = (req, res) => {
  if (req.body.followerId && req.body.followingId) {
    User.removeFollowing(req.body.followerId, req.body.followingId, (err) => {
      if (err) throw err;
    })
    User.removeFollower(req.body.followerId, req.body.followingId, (err) => {
      if (err) throw err;
      res.json({
        success: true,
        status: 10
      })
    })
  }
}
