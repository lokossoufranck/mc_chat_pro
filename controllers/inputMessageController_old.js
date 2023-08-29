const dbconf=require('../dbconf');
const bcrypt = require('bcrypt');


//Update inputmessage
exports.updateInputMessage= (req, res,next)=> {
  let inputmessage = req.body;
  let inputmessage_id = req.params.id;
  if (!inputmessage_id) {
      return res.status(400).json({ error: true, message: 'Please provide inputmessage_id' });
  }
 if (!inputmessage) {
     res.status(400).send({ error:true, message: 'Please provide inputmessage' });
  }
let = whereClause={id:inputmessage_id};
dbconf.mysqlCon.query(`UPDATE inputmessages SET ?`,[inputmessage,whereClause], function (error, results, fields) {
if (error) throw error;
  res.status(200).json({ error: false, results, message: 'New inputmessage has been created successfully.' });
  });

}
exports.getAllInputMessages= (req, res,next)=> {
  dbconf.mysqlCon.query('SELECT * FROM inputmessages', function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
  });
}



exports.getLatestInputmessages= (req, res,next)=> {

  let user_id = req.body.user_id;

  if (!user_id) {
      return res.status(400).json({ error: true, message: 'Please provide user_id' });
  }

  dbconf.mysqlCon.query(`SELECT * , (SELECT COUNT(*) FROM inputmessages im where im.is_read=0 and im.subcriber_id=m.subcriber_id) news_msg_count
FROM inputmessages m
WHERE id = (SELECT MAX(id) FROM inputmessages WHERE  m.wp_number_sender = wp_number_sender)
     AND discussion_id in (select discussion_id from outputmessages where user_id=?)
ORDER BY m.id DESC`,user_id, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
  });
}



exports.getAllInputMessagesOnLine= (req, res,next)=> {
  dbconf.mysqlCon.query('SELECT * FROM inputmessages where is_on_line=1', function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
  });
}
exports.finInputMessage=(req, res)=> {
  let inputmessage_id = req.params.id;
  if (!inputmessage_id) {
      return res.status(400).json({ error: true, message: 'Please provide inputmessage_id' });
  }
 dbconf.mysqlCon.query('SELECT * FROM inputmessages where id=?', inputmessage_id, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json( results[0]);
  });

}
exports.getFirstInputMessageOnline= (req, res,next)=> {
  // Retourne la première personne en ligne
 dbconf.mysqlCon.query('SELECT * FROM inputmessages where is_on_line=1 ORDER BY 	lastdate_connexion ASC limit 1', function (error, results, fields) {
      if (error) throw error;
      res.status(200).json( results[0]);
  });
}

exports.getInputMessagesBySubcriber= (req, res,next)=> {
  // Retourne le message précedent
  let subcriber_id = req.body.subcriber_id;
  if (!subcriber_id) {
      return res.status(400).json({ error: true, message: 'Please provide subcriber_id' });
  }
 dbconf.mysqlCon.query('SELECT *, 1 as col FROM inputmessages where subcriber_id=? ORDER BY id DESC ',subcriber_id, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json( results);
  });
}

exports.readMessagesBySubcriber= (req, res,next)=> {
  // Retourne le message précedent
  let subcriber_id = req.body.subcriber_id;
  if (!subcriber_id) {
      return res.status(400).json({ error: true, message: 'Please provide subcriber_id' });
  }
 dbconf.mysqlCon.query('UPDATE inputmessages set is_read=1 where subcriber_id=?',subcriber_id, function (error, results, fields) {
      if (error) throw error;
      res.status(200).json( results);
  });
}


exports.getMessagesBySubcriber= (req, res,next)=> {
 // Retourne le message précedent
  let wp_number_sender = req.body.wp_number_sender;
  if (!wp_number_sender) {
      return res.status(400).json({ error: true, message: 'Please provide wp_number_sender' });
  }
 dbconf.mysqlCon.query(`select * from (SELECT id,body,type,filename,mimetype,length,has_media,wp_number_sender,wp_number_receiver,discussion_id,is_read,created_at, 1 as sender FROM inputmessages WHERE wp_number_sender=?
UNION
SELECT 
id,body,type,filename,mimetype,length,has_media,wp_number_sender,wp_number_receiver,discussion_id,is_read,created_at, 0 as sender
FROM outputmessages WHERE wp_number_receiver=?) as t ORDER by created_at asc`,[`${wp_number_sender}`, `${wp_number_sender}`], function (error, results, fields) {
      if (error) throw error;
      res.status(200).json( results);
  });
}










