const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const autoIncrement = require('mongoose-auto-increment');


const UserSchema = mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
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

module.exports.getUserById = function (id, callback) {
  UserModel.findById(id, callback)
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
