const express = require('express');
const router=express.Router();
const dbconf=require('../dbconf');
const discussionCtrl = require('../controllers/discussionController');
var dbConn =dbconf.mysqlCon;
// Retrieve all discussions
router.get('/discussions', discussionCtrl.getAllDiscussions);
//Update discussion in database
//router.put('/discussion/:id', discussionCtrl.updateDiscussion);
router.put('/discussion/:id', discussionCtrl.updateDiscussion);
// Retrieve discussion by id
router.get('/discussion/:id',  discussionCtrl.finDiscussion);
//Add discussion in database
router.post('/discussion', discussionCtrl.createDiscussion);
router.post('/closediscussions', discussionCtrl.getClosedDiscussions);
router.post('/closediscussionsbyuser', discussionCtrl.getClosedDiscussionsByUser);
router.post('/getreportgroupbynumber', discussionCtrl.getReportGroupByNumber);
router.post('/getreportgroupbyqualification', discussionCtrl.getReportGroupByQualification);





module.exports=router;