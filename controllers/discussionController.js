const dbconf = require('../dbconf');
const bcrypt = require('bcrypt');
const Discussion = require('../models/Discussions');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

exports.finDiscussion = async (req, res) => {

  try {
    await Discussion.findById(new ObjectId(req.params.id) )
    .then(dsc => {

      return res.status(200).send({ error: false, dsc, message: 'Please provide inputmessage id' });

    }).catch(error => {
      return res.status(400).send({ error: true, error, message: 'Please provide inputmessage id' });

    })
    
  } catch (error) {
    return res.status(400).send({ error: true,  message: `couldnt find reccord with ${req.params.id} `});
  }

 



}


