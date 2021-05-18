const express = require('express');
const router = express.Router();

const OrganizationController = require('../controllers/organization.controller');

router.post('/newOrganization', OrganizationController.post_new_org);
router.put('/updateOrganization', OrganizationController.put_update_org);
router.delete('/deleteOrgById', OrganizationController.delete_org);
router.get('/getOrganizationById', OrganizationController.get_org_by_id);
router.get('/getOrganizationsById', OrganizationController.get_orgs_by_id);
router.put('/followToOrganization', OrganizationController.put_follow_to_org);
router.put('/unFollowToOrganization', OrganizationController.put_unfollow_to_org);

module.exports = router;
