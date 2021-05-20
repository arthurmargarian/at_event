const EventTypes = require('../models/event-type.model');
const Location = require('../models/location.model');

module.exports.get_event_types = (req, res, next) => {
  EventTypes.getAllTypes((err, types) => {
    if (err) throw err;
    res.json({
      success: true,
      model: types,
      status: 10
    })
  })
};

module.exports.get_locations = (req, res, next) => {
  Location.getAllLocations((err, locations) => {
    if (err) throw err;
    res.json({
      success: true,
      model: locations,
      status: 10
    })
  })
};
