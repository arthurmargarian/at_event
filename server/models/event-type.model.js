const mongoose = require('mongoose');

const EventTypeSchema = mongoose.Schema({
  label: {
    type: String,
    require: true,
  },
  id: {
    type: Number,
    require: true,
  }
});

const EventTypeModel = module.exports = mongoose.model('Event-Type', EventTypeSchema);

module.exports.getAllTypes = function (callback) {
  const query = {};
  EventTypeModel.find(query, callback)
}
