const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


const EventSchema = mongoose.Schema({
  id: {type: Number, require: false},
  orgId: {type: Number, require: false},
  userId: {type: Number, require: false},
  name: {type: String, require: true},
  type: {type: Number, require: true},
  typeName: {type: String, require: true},
  photoUrl: {type: String, require: true},
  region: {type: Number, require: true},
  regionName: {type: String, require: true},
  city: {type: Number, require: true},
  cityName: {type: String, require: true},
  status: {type: Number, require: true},
  statusName: {type: String, require: true},
  isClosed: {type: Boolean, require: true},
  isCanceled: {type: Boolean, require: true},
  isFromOrg: {type: Boolean, require: true},
  streetAndAddress: {type: String, require: true},
  description: {type: String, require: true},
  startDate: {type: Date, require: true},
  startTime: {type: Object, require: true},
  endDate: {type: Date, require: false},
  endTime: {type: Object, require: false},
  interestedUserIds: {type: Array, require: true},
});

// AutoIncrement Id
const connection = mongoose.createConnection("mongodb+srv://user:pass@mean-db.cqwkl.mongodb.net/at-event", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

autoIncrement.initialize(connection);

EventSchema.plugin(autoIncrement.plugin, {
  model: 'Event',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});


const EventModel = module.exports = mongoose.model('Event', EventSchema);

// Methods

module.exports.addEvent = function (newEvent, callback) {
  newEvent.save(callback);
}

module.exports.updateEvent = function (event, callback) {
  const findQuery = {id: event.id};
  const updateQuery = {};
  const options = {new: true};
  EventModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.getAll = function (callback) {
  const query = {};
  EventModel.find(query, callback);
}

module.exports.search = function (params, callback) {
  const query = {
    $or: [
      {name: `/${params.name}/`},
      {type: +params.type},
      {status: +params.status},
      {region: +params.region},
    ]
  };
  EventModel.find(query, callback);
}

module.exports.getEventsByRegionId = function (region, callback) {
  const query = {region: region};
  EventModel.find(query, callback);
}

module.exports.getEventsByUserId = function (userId, callback) {
  const query = {userId: userId};
  EventModel.find(query, callback);
}

module.exports.searchEventsByName = function (name, callback) {
  const query = {name: `/${name}/`};
  EventModel.find(query, callback);
}
module.exports.getEventsByTypeIds = function (typeIds, callback) {
  const query = {type: {$in: typeIds}};
  EventModel.find(query, callback);
}

module.exports.getEventsByStatusId = function (status, callback) {
  const query = {status: status};
  EventModel.find(query, callback);
}

module.exports.getEventsByTypeId = function (type, callback) {
  const query = {type: type};
  EventModel.find(query, callback);
}

module.exports.getEventById = function (id, callback) {
  const query = {id: id};
  EventModel.findOne(query, callback);
}

module.exports.deleteEventById = function (id, callback) {
  const query = {id: id};
  EventModel.deleteOne(query, callback);
}

module.exports.getEventsById = function (ids, callback) {
  const query = {id: ids};
  EventModel.find(query, callback);

}
module.exports.addInterested = function (userId, eventId, callback) {
  const findQuery = {id: eventId};
  const updateQuery = {$push: {interestedUserIds: userId}};
  const options = {new: true};
  EventModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.removeInterested = function (userId, eventId, callback) {
  const findQuery = {id: eventId};
  const updateQuery = {$pull: {interestedUserIds: userId}};
  const options = {new: true};
  EventModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

