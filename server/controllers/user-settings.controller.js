const UserSetting = require('../models/user-setting.model');

module.exports.user_setting_post = (req, res, next) => {
  const userId = req.body.id;
  const languageId = req.body.language;
  const userSetting = new UserSetting({
    user_id: userId,
    language: languageId,
  });
  UserSetting.findSettingByUserId(userId, (err, setting) => {
    if (err) throw err;
    if (setting) {
      UserSetting.updateSetting(userSetting, (err, settingFromDB) => {
        if (err) throw err;
        res.json({
          success: true,
          status: 10
        })
      });
    } else {
      UserSetting.addSetting(userSetting, (err, settingFromDB) => {
        res.json({
          success: true,
          status: 10
        })
      });
    }
  })
};


module.exports.user_setting_get = (req, res, next) => {
  const userId = req.query.id;
  UserSetting.findSettingByUserId(userId, (err, setting) => {
    if (err) throw err;
    res.json({
      success: true,
      model: setting,
      status: 10
    })
  })
}


