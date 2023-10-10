const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Inputmessages = require("../models/Inputmessages");
var moment = require('moment'); // require

exports.createInputMessage = (req, res, next) => {

  let inputMsg = req.body;
  if (!inputMsg) {
    res.status(400).send({ error: true, message: 'Please provide inputmessage' });
  }
  var Msg = new Inputmessages(inputMsg);
  Msg.save().then(msg => {
    return res.status(200).json({ error: false, Msg, message: 'New inputmessage has been created successfully.' });
  }).catch((error) => {
    return res.status(401).json({ error: true, message: error })
  });

}



//Update InputMessage
exports.updateInputMessage = (req, res, next) => {
  let inputmessage_id = req.params.id;
  if (!inputmessage_id) {
    return res.status(400).json({ error: true, message: "Entrer votre l'identifiant du message" });
  }
  Inputmessages.findOne({ _id: inputmessage_id }).then((msg) => {
    return msg;
  }).then((msg) => {
    if (msg != null) {
      msg.wp_number_sender = req.body?.wp_number_sender ? req.body.wp_number_sender : msg.wp_number_sender
      msg.wp_number_receiver = req.body?.wp_number_receiver ? req.body.wp_number_receiver : msg.wp_number_receiver
      msg.discussion_id = req.body?.discussion_id ? req.body.discussion_id : msg.discussion_id
      msg.user_id = req.body?.user_id ? req.body.user_id : msg.user_id
      msg.body = req.body?.body ? req.body.body : msg.body
      msg.type = req.body?.type ? req.body.type : msg.type
      msg.save()
      return res.status(401).json({ error: false, msg, message: 'InputMessage has been updated' });
    } else {
      return res.status(401).json({ error: true, message: 'This InputMessage not exist' });
    }
  })

}

exports.findInputMessage = (req, res, next) => {
  var _id = req.body._id

  if (!_id) {
    res.status(400).send({ error: true, message: 'Please provide inputmessage id' });
  }else{
    try {
      _id = new mongoose.mongo.ObjectId(req.body.user_id);
      
    } catch (error) {
      res.status(400).send({ error: true, message: 'Discussion id is not correct' });
    }
  }

  Inputmessages.findOne({ _id: _id }).then((msg) => {
    res.status(200).send({ error: true, msg, message: 'Please provide inputmessage id' });
  })

}





