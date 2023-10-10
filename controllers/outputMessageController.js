const dbconf = require('../dbconf');
const Outputmessages = require("../models/Outputmessages");
const mongoose = require('mongoose');
const Discussion = require('../models/Discussions');
const { ObjectId } = require('mongodb');



// Create outputmessage 
exports.createOutputMessage = async (req, res, next) => {

  let msg = req.body;
  if (!msg) {
    res.status(400).send({ error: true, message: 'Please provide outputmessage' });
  }

  if (!msg.body || msg.body == "" || msg.body == undefined) {
    res.status(400).send({ error: true, message: 'Please provide body field' });
  }

  if (!msg.user_id || msg.user_id == "" || msg.user_id == undefined) {
    res.status(400).send({ error: true, message: 'Please provide user_id field' });
  }

  /*if (!msg.discussion_id || msg.discussion_id == "" || msg.discussion_id == undefined) {
    res.status(400).send({ error: true, message: 'Please provide discussion_id field' });
  }*/

  if (!msg.wp_number_sender || msg.wp_number_sender == "" || msg.wp_number_sender == undefined) {
    res.status(400).send({ error: true, message: 'Please provide wp_number_sender field' });
  }

  if (!msg.wp_number_receiver || msg.wp_number_receiver == "" || msg.wp_number_receiver == undefined) {
    res.status(400).send({ error: true, message: 'Please provide wp_number_receiver field' });
  }
  // ENVOIE DU MESSAGE //
  const axios = require('axios');
  let data = JSON.stringify({
    "messaging_product": "whatsapp",
    "preview_url": false,
    "recipient_type": "individual",
    "to": msg.wp_number_receiver,
    "type": "text",
    "text": {
      "body": msg.body
    }
  });

  const token ='EAB78Hn4B4xUBO0TjEOHKor1NLov4uW6ysfZBn1kkpZATTg8B0rk3u0Bgo5P1ekQdhYHFiTDeg0slXpqz7PanBW3ZCOxRZA5QZBhZAE4FZArm4uSM3GmE7WD45LqWgOFRvJ3r0onuyPQH3WLaUZAKTVMJ6Eer0uGLZAazz7KUcMPwymDQmMWnh4fbZBcTfwfYZCZATsIIPMZCtL9OnUyEZACGnrAZAOhpGdgZANX9';
 

  

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://graph.facebook.com/v17.0/107557182266835/messages',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token
    },
    data: data
  };

  await axios.request(config)
    .then((response) => {
      return (JSON.stringify(response.data));
    }).then((data) => {



      msg.discussion_id = new ObjectId(msg.discussion_id);
      msg.user_id = new ObjectId(msg.user_id);
      var Msg = new Outputmessages({
        body: msg.body,
        user_id: msg.user_id,
        discussion_id: msg.discussion_id,
        wp_number_sender: msg.wp_number_sender,
        wp_number_receiver: msg.wp_number_receiver
      });


      Msg.save().then(msg => {
        return res.status(200).json({ error: false, Msg, message: 'New outputmessage has been created successfully.' });
      }).catch((error) => {
        return res.status(401).json({ error: true, message: error })
      });

    })
    .catch((error) => {
      console.log(error);
    });


  /**/

  /*
    let outMsg = req.body;
    if (!outMsg) {
      res.status(400).send({ error: true, message: 'Please provide outputmessage' });
    }
    if (req.body.user_id) {
      const _id = new mongoose.mongo.ObjectId(req.body.user_id);
      req.body.user_id = _id;
    }
    if (req.body.discussion_id) {
      req.body.discussion_id = new mongoose.mongo.ObjectId(req.body.discussion_id);;
    }
  
   */
  //FIN ENVOIE DU MESSAGE//












}

//Update outputmessage
exports.updateOutputMessage = (req, res, next) => {
  let outputmessage = req.body;
  let outputmessage_id = req.params.id;
  if (!outputmessage_id) {
    return res.status(400).json({ error: true, message: 'Please provide outputmessage_id' });
  }
  if (!outputmessage) {
    res.status(400).send({ error: true, message: 'Please provide outputmessage' });
  }
  let = whereClause = { id: outputmessage_id };
  dbconf.mysqlCon.query(`UPDATE outputmessages SET ?`, [outputmessage, whereClause], function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({ error: false, results, message: 'New outputmessage has been created successfully.' });
  });

}
exports.getAllOutputMessages = (req, res, next) => {
  dbconf.mysqlCon.query('SELECT * FROM outputmessages', function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });
}

exports.getAllOutputMessagesOnLine = (req, res, next) => {
  dbconf.mysqlCon.query('SELECT * FROM outputmessages where is_on_line=1', function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });
}
exports.finOutputMessage = (req, res) => {
  let outputmessage_id = req.params.id;
  if (!outputmessage_id) {
    return res.status(400).json({ error: true, message: 'Please provide outputmessage_id' });
  }
  dbconf.mysqlCon.query('SELECT * FROM outputmessages where id=?', outputmessage_id, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results[0]);
  });

}
exports.getFirstOutputMessageOnline = (req, res, next) => {
  // Retourne la première personne en ligne
  dbconf.mysqlCon.query('SELECT * FROM outputmessages where is_on_line=1 ORDER BY 	lastdate_connexion ASC limit 1', function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results[0]);
  });
}



exports.getOutputMessagesByUser = (req, res, next) => {
  // Retourne le message précedent
  let user_id = req.body.user_id;
  if (!user_id) {
    res.status(400).send({ error: true, message: 'Please provide outputmessage' });
  }
  dbconf.mysqlCon.query('SELECT *, 0 as col FROM outputmessages where user_id=? ORDER BY id DESC', user_id, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });
}
