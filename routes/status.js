const express = require('express');
const router=express.Router();
const dbconf=require('../dbconf');
const statusCtrl = require('../controllers/statusController');
var dbConn =dbconf.mysqlCon;
// Retrieve all status
router.get('/status', statusCtrl.getAllStatus);




module.exports=router;