const mongoose = require('mongoose');

const UserSettingSchema = mongoose.Schema({
  userId: {
    type: Number,
    require: true,
  },
  language: {
    type: Number,
    require: true,
  }
});

const UserSettingModel = module.exports = mongoose.model('UserSetting', UserSettingSchema);

module.exports.findSettingByUserId = function (userId, callback) {
  const query = {userId: userId};
  UserSettingModel.findOne(query, callback);
}
module.exports.addSetting = function (newSetting, callback) {
  newSetting.save(callback);
}

module.exports.updateSetting = function (setting, callback) {
  UserSettingModel.findOneAndUpdate({userId: setting.userId}, {language: setting.language}, {new: true}, callback);
}
