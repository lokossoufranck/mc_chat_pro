const express = require('express');
const router=express.Router();
const dbconf=require('../dbconf');
const dsCtrl = require('../controllers/discussion_statusController');
//const auth = require('../middleware/auth');
//var dbConn =dbconf.mysqlCon;


router.post('/discussion_status', dsCtrl.create);
router.put('/discussion_status/:id', dsCtrl.update);
router.get('/discussion_status/:id',  dsCtrl.find);
router.get('/last_discussion_status/:discussion_id',  dsCtrl.getLast);
router.get('/status_by_discussion/:discussion_id',  dsCtrl.getStatusByDiscussion);



module.exports=router;