const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const autoIncrement = require('mongoose-auto-increment');


const UserSchema = mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isSocial: {
    type: Boolean,
    require: true,
  },
  activeOrgId: {
    type: Number,
    require: false,
  },
  photoUrl: {
    type: String,
    require: false,
  },
  contactNumber: {
    type: String,
    require: false,
  },
  contactEmail: {
    type: String,
    require: false,
  },
  orgIds: {
    type: Array,
    require: false,
  },
  eventIds: {
    type: Array,
    require: false,
  },
  interestedTypeIds: {
    type: Array,
    require: false,
  },
  followingUserIds: {
    type: Array,
    require: false,
  },
  followingEventIds: {
    type: Array,
    require: false,
  },
  followingOrgIds: {
    type: Array,
    require: false,
  },
  followerIds: {
    type: Array,
    require: false,
  }
});

// AutoIncrement Id
const connection = mongoose.createConnection("mongodb+srv://user:pass@mean-db.cqwkl.mongodb.net/at-event", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

autoIncrement.initialize(connection);

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});


const UserModel = module.exports = mongoose.model('User', UserSchema);

// Methods

module.exports.findUserById = function (id, callback) {
  UserModel.findById(id, callback)
}

module.exports.getUserById = function (id, callback) {
  const query = {id: id};
  UserModel.findOne(query, callback);
}

module.exports.updateUsersById = function (user, callback) {
  const query = {id: user.id};
  const updateQuery = {
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.firstName + ' ' + user.lastName,
    contactNumber: user.contactNumber,
    contactEmail: user.contactEmail,
  };
  UserModel.findOneAndUpdate(query, updateQuery, callback);
}

module.exports.getUsersById = function (ids, callback) {
  const query = {id: ids};
  UserModel.find(query, callback);
}

module.exports.addFollower = function (followerId, followingId, callback) {
  const findQuery = {id: followingId};
  const updateQuery = {$push: {followerIds: followerId}};
  const options = {new: true};
  UserModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.addFollowing = function (followerId, followingId, callback) {
  const findQuery = {id: followerId};
  const updateQuery = {$push: {followingUserIds: followingId}};
  const options = {new: true};
  UserModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.addFollowingToOrg = function (followerId, orgId, callback) {
  const findQuery = {id: followerId};
  const updateQuery = {$push: {followingOrgIds: orgId}};
  const options = {new: true};
  UserModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.removeFollower = function (followerId, followingId, callback) {
  const findQuery = {id: followingId};
  const updateQuery = {$pull: {followerIds: followerId}};
  const options = {new: true};
  UserModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.removeFollowing = function (followerId, followingId, callback) {
  const findQuery = {id: followerId};
  const updateQuery = {$pull: {followingUserIds: followingId}};
  const options = {new: true};
  UserModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.removeFollowingToOrg = function (followerId, orgId, callback) {
  const findQuery = {id: followerId};
  const updateQuery = {$pull: {followingOrgIds: orgId}};
  const options = {new: true};
  UserModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.addOrganization = function (userId, orgId, callback) {
  const findQuery = {id: userId};
  const updateQuery = {$push: {orgIds: orgId}};
  const options = {new: true};
  UserModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.removeOrganization = function (userId, orgId, callback) {
  const findQuery = {id: userId};
  const updateQuery = {$pull: {orgIds: orgId}};
  const options = {new: true};
  UserModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.getUserByEmail = function (email, callback) {
  const query = {email: email};
  UserModel.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        throw err
      }
      newUser.password = hash;
      newUser.save(callback);
    })
  })
}

module.exports.comparePassword = function (password, hash, callback) {
  bcrypt.compare(password, hash, (err, isMatch) => {
    if (err) {
      throw err
    }
    callback(null, isMatch);
  })
}
