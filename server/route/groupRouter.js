const router = require('express').Router();

const { getAllGroups, getGroupById } = require('../controllers/groupController.js');


router.get('/', getAllGroups);

router.get('/:id', getGroupById);


module.exports = router;
