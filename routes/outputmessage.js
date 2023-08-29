const express = require('express');
const router=express.Router();
const dbconf=require('../dbconf');
const outputmessageCtrl = require('../controllers/outputMessageController');
var dbConn =dbconf.mysqlCon;

// Retrieve all outputmessages
router.get('/outputmessages', outputmessageCtrl.getAllOutputMessages);
//Update outputmessage in database
//router.put('/outputmessage/:id', outputmessageCtrl.updateOutputMessage);
router.put('/outputmessage/:id', outputmessageCtrl.updateOutputMessage);
// Retrieve outputmessage by id
router.get('/outputmessage/:id',  outputmessageCtrl.finOutputMessage);
//Add outputmessage in database
router.post('/outputmessage', outputmessageCtrl.createOutputMessage);
//Get all outputmessages on line
router.get('/outputmessagesonline', outputmessageCtrl.getAllOutputMessagesOnLine);
//Get first outputmessage on line
router.get('/firstoutputmessageonline', outputmessageCtrl.getFirstOutputMessageOnline);
router.post('/outputmessagesbyuser', outputmessageCtrl.getOutputMessagesByUser);



module.exports=router;

