const express = require('express');
const router=express.Router();
const dbconf=require('../dbconf');
const userCtrl = require('../controllers/userController');
const auth = require('../middleware/auth');
var dbConn =dbconf.mysqlCon;

// Retrieve all users
router.get('/users', userCtrl.getAllUsers);
//router.post('/usersby', userCtrl.getUsersBy);

//Update user in database
//router.put('/user/:id', userCtrl.updateUser);
router.put('/user/:id', userCtrl.updateUser);
//router for login
router.post('/auth/signin', userCtrl.signin);

//router for logout 
router.post('/auth/logout', userCtrl.logout);

// Retrieve user by id
//router.get('/user/:id',  userCtrl.finUser);
//Add user in database
router.post('/auth/signup', userCtrl.signup);
//Get all users on line
//router.get('/usersonline', userCtrl.getAllUsersOnLine);
//Get first user on line
router.get('/firstuseronline', userCtrl.getFirstUserOnline);
module.exports=router;
//Get first user in ques
// router.get('/firstuseronline', userCtrl.getFirstUserOnline);
//Get first user in ques
//router.get('/firstuserinwaitingline', userCtrl.getFirstUserInWaitingLine);



module.exports=router;