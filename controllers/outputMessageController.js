const dbconf = require('../dbconf');
const bcrypt = require('bcrypt');

// Create outputmessage 
exports.createOutputMessage = (req, res, next) => {
  let outputMsg = req.body;
  if (!outputMsg) {
    res.status(400).send({ error: true, message: 'Please provide outputmessage' });
  }

  dbconf.mysqlCon.query(`INSERT INTO outputmessages
  (body,type,filename,mimetype,length,has_media, wp_number_sender, 
  wp_number_receiver, discussion_id, user_id,is_read, created_at) 
  VALUES (?,?,?,?,?,?,?,?,?,?,?,now())`,
    [
      `${outputMsg.body}`,
      `${outputMsg.type}`,
      `${outputMsg.filename}`,
      `${outputMsg.mimetype}`,
      `${outputMsg.length}`,
      `${outputMsg.has_media}`,
      `${outputMsg.wp_number_sender}`,
      `${outputMsg.wp_number_receiver}`,
      `${outputMsg.discussion_id}`,
      `${outputMsg.user_id}`,
      `${outputMsg.is_read}`
    ], function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({ error: false, results, message: 'New outputmessage has been created successfully.' });
    });

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



exports.getOutputMessagesByUser= (req, res,next)=> {
  // Retourne le message précedent
let user_id = req.body.user_id;
  if (!user_id) {
    res.status(400).send({ error: true, message: 'Please provide outputmessage' });
  }
 dbconf.mysqlCon.query('SELECT *, 0 as col FROM outputmessages where user_id=? ORDER BY id DESC',user_id, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json( results);
  });
}
