const express = require('express');
const router=express.Router();
const dbconf=require('../dbconf');
const inputmessageCtrl = require('../controllers/inputMessageController');



router.put('/inputmessage/:id', inputmessageCtrl.updateInputMessage);
router.get('/inputmessage/:id',  inputmessageCtrl.findInputMessage);
router.post('/inputmessage', inputmessageCtrl.createInputMessage);
//Get all inputmessages on line
//router.get('/inputmessagesonline', inputmessageCtrl.getAllInputMessagesOnLine);
//Get first inputmessage on line
//router.get('/firstinputmessageonline', inputmessageCtrl.getFirstInputMessageOnline);
// Get  input message
//router.post('/inputmessagesbysubcriber',  inputmessageCtrl.getInputMessagesBySubcriber);
//router.post('/messagesbysubcriber',  inputmessageCtrl.getMessagesBySubcriber);
//router.post('/readmessagesbysubcriber',  inputmessageCtrl.readMessagesBySubcriber);


module.exports=router;