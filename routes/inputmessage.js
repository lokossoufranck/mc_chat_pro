const express = require('express');
const router=express.Router();
const dbconf=require('../dbconf');
const inputmessageCtrl = require('../controllers/inputMessageController');
var dbConn =dbconf.mysqlCon;
// Retrieve all inputmessages
router.get('/inputmessages', inputmessageCtrl.getAllInputMessages);
// Retrieve latest input message
router.post('/latestinputmessages', inputmessageCtrl.getLatestInputmessages);


//Update inputmessage in database
//router.put('/inputmessage/:id', inputmessageCtrl.updateInputMessage);
router.put('/inputmessage/:id', inputmessageCtrl.updateInputMessage);
// Retrieve inputmessage by id
router.get('/inputmessage/:id',  inputmessageCtrl.finInputMessage);
//Add inputmessage in database
//router.post('/inputmessage', inputmessageCtrl.createInputMessage);
//Get all inputmessages on line
router.get('/inputmessagesonline', inputmessageCtrl.getAllInputMessagesOnLine);
//Get first inputmessage on line
router.get('/firstinputmessageonline', inputmessageCtrl.getFirstInputMessageOnline);
// Get  input message
router.post('/inputmessagesbysubcriber',  inputmessageCtrl.getInputMessagesBySubcriber);
router.post('/messagesbysubcriber',  inputmessageCtrl.getMessagesBySubcriber);
router.post('/readmessagesbysubcriber',  inputmessageCtrl.readMessagesBySubcriber);


module.exports=router;