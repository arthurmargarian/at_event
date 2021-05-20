const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  id: {
    type: Number,
    require: true,
  },
  regCity: {
    type: Array,
    require: true,
  }
});

const LocationModel = module.exports = mongoose.model('Location', LocationSchema);

module.exports.getAllLocations = function (callback) {
  const query = {};
  LocationModel.find(query, callback)
}
