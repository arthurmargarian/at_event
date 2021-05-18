const EventTypes = require('../models/event-type.model');

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
