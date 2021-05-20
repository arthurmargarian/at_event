const express = require('express');
const router = express.Router();

const EventController = require('../controllers/event.controller');

router.post('/new', EventController.post_new);
router.put('/update', EventController.put_update);
router.get('/getById', EventController.get_by_id);
router.get('/getByRegion', EventController.get_by_region);
router.get('/getByUserId', EventController.get_by_user_id);
router.get('/getByStatus', EventController.get_by_status);
router.get('/getByType', EventController.get_by_type);
router.get('/getByTypes', EventController.get_by_types);
router.get('/searchByName', EventController.get_search_by_name);
router.get('/search', EventController.search);
router.get('/getAll', EventController.get_all);
router.get('/getByIds', EventController.get_by_ids);
router.put('/interested', EventController.put_interested);
router.put('/unInterested', EventController.put_uninterested);
router.delete('/delete', EventController.delete_by_id);

module.exports = router;
