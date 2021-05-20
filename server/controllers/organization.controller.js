const Organization = require('../models/organization.model');
const User = require('../models/user.model');

module.exports.post_new_org = (req, res, next) => {
  const ownerId = req.body.ownerId;
  const newOrg = new Organization({
    ownerId: req.body.ownerId,
    name: req.body.name,
    about: req.body.about,
    photoUrl: 'https://images.all-free-download.com/images/graphicthumb/office_building_architecture_sketch_modern_colored_3d_design_6839636.jpg',
    contactNumber: req.body.contactNumber,
    address: req.body.address,
    contactEmail: req.body.contactEmail,
    eventIds: req.body.eventIds,
    followerIds: req.body.followerIds,
    orgEventTypeIds: req.body.orgEventTypeIds,
  });
  Organization.addOrg(newOrg, (err, createdOrg) => {
    if (err) throw err;
    if (createdOrg) {
      User.addOrganization(ownerId, createdOrg.id, (err, user) => {
        if (err) throw err;
        if (user) {
          res.json({
            success: true,
            status: 10
          })
        } else {
          res.json({
            success: false,
            status: 0
          })
        }
      })
    } else {
      res.json({
        success: false,
        status: 0
      })
    }
  });
};

module.exports.put_update_org = (req, res, next) => {
  Organization.updateOrg(req.body, (err, org) => {
    if (err) throw err;
    if (org) {
      res.json({
        success: true,
        status: 10
      })
    } else {
      res.json({
        success: false,
        status: 0
      })
    }
  });
};
module.exports.delete_org = (req, res, next) => {
  Organization.deleteOrgById(req.query.id, (err) => {
    if (err) throw err;
    User.removeOrganization(req.query.ownerId, req.query.id, (err, user) => {
      if (err) throw err;
      if (user) {
        res.json({
          success: true,
          status: 10
        })
      } else {
        res.json({
          success: false,
          status: 0
        })
      }
    })
  });
};


module.exports.get_org_by_id = (req, res) => {
  const orgId = req.query.id;
  Organization.getOrganizationById(orgId, (err, org) => {
    if (err) throw err;
    if (org) {
      res.json({
        success: true,
        model: org,
        status: 10
      })
    } else {
      res.json({
        success: false,
        model: null,
        status: 0
      })
    }
  })
}

module.exports.get_orgs_by_id = (req, res) => {
  const orgIds = req.query.orgIds.split(',');
  Organization.getOrganizationsById(orgIds, (err, orgs) => {
    if (err) throw err;
    if (orgs) {
      res.json({
        success: true,
        model: orgs,
        status: 10
      })
    } else {
      res.json({
        success: false,
        model: null,
        status: 0
      })
    }
  })

}

module.exports.put_follow_to_org = (req, res) => {
  if (req.body.followerId && req.body.orgId) {
    User.addFollowingToOrg(req.body.followerId, req.body.orgId, (err) => {
      if (err) throw err;
    })
    Organization.addFollower(req.body.followerId, req.body.orgId, (err) => {
      if (err) throw err;
      res.json({
        success: true,
        status: 10
      })
    })
  }
}

module.exports.put_unfollow_to_org = (req, res) => {
  if (req.body.followerId && req.body.orgId) {
    User.removeFollowingToOrg(req.body.followerId, req.body.orgId, (err) => {
      if (err) throw err;
    })
    Organization.removeFollower(req.body.followerId, req.body.orgId, (err) => {
      if (err) throw err;
      res.json({
        success: true,
        status: 10
      })
    })
  }
}
