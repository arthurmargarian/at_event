const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


const OrganizationSchema = mongoose.Schema({
  id: {
    type: Number,
    require: true,
  },
  ownerId: {
    type: Number,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  about: {
    type: String,
    require: true,
  },
  photoUrl: {
    type: String,
    require: false,
  },
  contactNumber: {
    type: String,
    require: false,
  },
  address: {
    type: String,
    require: false,
  },
  contactEmail: {
    type: String,
    require: false,
  },
  eventIds: {
    type: Array,
    require: false,
  },
  followerIds: {
    type: Array,
    require: false,
  },
  orgEventTypeIds: {
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

OrganizationSchema.plugin(autoIncrement.plugin, {
  model: 'Organization',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});


const OrganizationModel = module.exports = mongoose.model('Organization', OrganizationSchema);

// Methods

module.exports.addOrg = function (newOrg, callback) {
  newOrg.save(callback);
}

module.exports.updateOrg = function (org, callback) {
  const findQuery = {id: org.id};
  const updateQuery = {
    name: org.name,
    about: org.about,
    contactNumber: org.contactNumber,
    address: org.address,
    contactEmail: org.contactEmail,
    orgEventTypeIds: org.orgEventTypeIds,
  };
  const options = {new: true};
  OrganizationModel.findOneAndUpdate(findQuery, updateQuery, options, callback);

}

module.exports.getOrganizationById = function (id, callback) {
  const query = {id: id};
  OrganizationModel.findOne(query, callback);
}

module.exports.deleteOrgById = function (id, callback) {
  const query = {id: id};
  OrganizationModel.deleteOne(query, callback);
}

module.exports.getOrganizationsById = function (ids, callback) {
  const query = {id: ids};
  OrganizationModel.find(query, callback);

}
module.exports.addFollower = function (followerId, orgId, callback) {
  const findQuery = {id: orgId};
  const updateQuery = {$push: {followerIds: followerId}};
  const options = {new: true};
  OrganizationModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.removeFollower = function (followerId, orgId, callback) {
  const findQuery = {id: orgId};
  const updateQuery = {$pull: {followerIds: followerId}};
  const options = {new: true};
  OrganizationModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.addEvent = function (orgId, eventId, callback) {
  const findQuery = {id: orgId};
  const updateQuery = {$push: {eventIds: eventId}};
  const options = {new: true};
  OrganizationModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

module.exports.removeEvent = function (orgId, eventId, callback) {
  const findQuery = {id: orgId};
  const updateQuery = {$pull: {eventIds: eventId}};
  const options = {new: true};
  OrganizationModel.findOneAndUpdate(findQuery, updateQuery, options, callback);
}

