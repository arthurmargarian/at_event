const Event = require('../models/event.model');
const User = require('../models/user.model');
const Organization = require('../models/organization.model');

module.exports.post_new = (req, res, next) => {
  const newEvent = new Event({
    orgId:req.body.orgId,
    userId:req.body.userId,
    name:req.body.name,
    type:req.body.type,
    typeName:req.body.typeName,
    photoUrl:req.body.photoUrl,
    region:req.body.region,
    regionName:req.body.regionName,
    city:req.body.city,
    cityName:req.body.cityName,
    status:req.body.status,
    statusName:req.body.statusName,
    isClosed:req.body.isClosed,
    isCanceled:req.body.isCanceled,
    isFromOrg:req.body.isFromOrg,
    streetAndAddress:req.body.streetAndAddress,
    description:req.body.description,
    startDate:req.body.startDate,
    startTime:req.body.startTime,
    endDate:req.body.endDate,
    endTime:req.body.endTime,
    interestedUserIds:req.body.interestedUserIds,
  })
  Event.addEvent(newEvent, (err, event) => {
    if (err) throw err;
    if (event) {
      if (event.isFromOrg) {
        Organization.addEvent(event.orgId, event.id, (err, org) => {
          if (err) throw err;
          res.json({
            success: true,
            model: event,
            status: 10
          })
        })
      } else {
        User.addEvent(event.userId, event.id, (err, user) => {
          if (err) throw err;
          res.json({
            success: true,
            model: event,
            status: 10
          })
        })
      }
    }

  })
};

module.exports.put_update = (req, res, next) => {
  Event.updateEvent(req.body, (err, event) => {
    if (err) throw err;
    res.json({
      success: true,
      model: event,
      status: 10
    })
  })
};

module.exports.get_by_id = (req, res, next) => {
  const id = req.query.id;
  Event.getEventById(id, (err, event) => {
    if (err) throw err;
    res.json({
      success: true,
      model: event,
      status: 10
    })
  })
};

module.exports.get_by_region = (req, res, next) => {
  const region = req.query.regionId;
  Event.getEventsByRegionId(region, (err, events) => {
    if (err) throw err;
    res.json({
      success: true,
      model: events,
      status: 10
    })
  })
}
;module.exports.get_by_user_id = (req, res, next) => {
  const userId = req.query.userId;
  Event.getEventsByUserId(userId, (err, events) => {
    if (err) throw err;
    res.json({
      success: true,
      model: events,
      status: 10
    })
  })
};

module.exports.search = (req, res, next) => {
  Event.search(req.query, (err, events) => {
    if (err) throw err;
    res.json({
      success: true,
      model: events,
      status: 10
    })
  })
};

module.exports.get_search_by_name = (req, res, next) => {
  const name = req.query.name;
  Event.searchEventsByName(name, (err, events) => {
    if (err) throw err;
    res.json({
      success: true,
      model: events,
      status: 10
    })
  })
};

module.exports.get_by_status = (req, res, next) => {
  const status = req.query.statusId;
  Event.getEventsByStatusId(status, (err, events) => {
    if (err) throw err;
    res.json({
      success: true,
      model: events,
      status: 10
    })
  })
};

module.exports.get_by_type = (req, res, next) => {
  const type = req.query.typeId;
  Event.getEventsByTypeId(type, (err, events) => {
    if (err) throw err;
    res.json({
      success: true,
      model: events,
      status: 10
    })
  })
};

module.exports.get_all = (req, res, next) => {
  Event.getAll( (err, events) => {
    if (err) throw err;
    res.json({
      success: true,
      model: events,
      status: 10
    })
  })
};

module.exports.get_by_ids = (req, res, next) => {
  const ids = req.query.eventIds.split(',');
  Event.getEventsById(ids, (err, events) => {
    if (err) throw err;
    res.json({
      success: true,
      model: events,
      status: 10
    })
  })
};
module.exports.get_by_types = (req, res, next) => {
  const ids = req.query.typeIds.split(',');

  Event.getEventsByTypeIds(ids, (err, events) => {
    if (err) throw err;
    res.json({
      success: true,
      model: events,
      status: 10
    })
  })
};

module.exports.put_interested = (req, res, next) => {
  if (req.body.userId && req.body.eventId) {
    Event.addInterested(req.body.userId, req.body.eventId, (err) => {
      if (err) throw err;
    })
    User.addInterestedEvent(req.body.userId, req.body.eventId, (err) => {
      if (err) throw err;
      res.json({
        success: true,
        status: 10
      })
    })
  }
};

module.exports.put_uninterested = (req, res, next) => {
  if (req.body.userId && req.body.eventId) {
    Event.removeInterested(req.body.userId, req.body.eventId, (err) => {
      if (err) throw err;
    })
    User.removeInterestedEvent(req.body.userId, req.body.eventId, (err) => {
      if (err) throw err;
      res.json({
        success: true,
        status: 10
      })
    })
  }
};

module.exports.delete_by_id = (req, res, next) => {
  const id = req.query.id;
  const isFormOrg = req.query.isFormOrg;
  const ownerId = req.query.ownerId;
  Event.deleteEventById(id, (err) => {
    if (err) throw err;
    if (isFormOrg) {
      User.removeEvent(ownerId, id, (err, user) => {
        if (err) throw err;
        if (user) {
          res.json({
            success: true,
            status: 10
          })
        }
      })
    } else {
      Organization.removeEvent(ownerId, id, (err, user) => {
        if (err) throw err;
        if (user) {
          res.json({
            success: true,
            status: 10
          })
        }
      })
    }

  });
};
