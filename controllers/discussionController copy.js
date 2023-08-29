const dbconf = require('../dbconf');
const bcrypt = require('bcrypt');

exports.createDiscussion = (req, res, next) => {
  let discussion = req.body;
  if (!discussion) {
    res.status(400).send({ error: true, message: 'Please provide discussion' });
  }
  dbconf.mysqlCon.query(`INSERT INTO discussions(is_open, created_at) 
VALUES (?,now())`, [`${discussion.is_open}`], function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({ error: false, results, message: 'New discussion has been created successfully.' });
  });

}

//Update discussion
exports.updateDiscussion = (req, res, next) => {
  let discussion = req.body;
  let discussion_id = req.params.id;
  if (!discussion_id) {
    return res.status(400).json({ error: true, message: 'Please provide discussion_id' });
  }
  if (!discussion) {
    res.status(400).send({ error: true, message: 'Please provide discussion' });
  }
  let = whereClause = { id: discussion_id };
  dbconf.mysqlCon.query(`UPDATE discussions SET ?`, [discussion, whereClause], function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({ error: false, results, message: 'New discussion has been created successfully.' });
  });

}

exports.getAllDiscussions = (req, res, next) => {
  dbconf.mysqlCon.query('SELECT * FROM discussions', function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });
}

exports.getClosedDiscussions = (req, res, next) => {
  let datedebut = req.body.datedebut;
  let datefin = req.body.datefin;

  if (!datedebut) {
    return res.status(400).json({ error: true, message: 'Please provide datedebut' });
  }
  if (!datefin) {
    res.status(400).send({ error: true, message: 'Please provide datefin' });
  }
  //if (datedebut & datefin)
  dbconf.mysqlCon.query('SELECT * FROM discussions WHERE date(created_at) between ? and  ?', [`${datedebut}`, `${datefin}`], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.status(200).json(results);
  });
}


exports.getClosedDiscussionsByUser = (req, res, next) => {
  let datedebut = req.body.datedebut;
  let datefin = req.body.datefin;
  let user_id = req.body.user_id;

  if (!datedebut) {
    return res.status(400).json({ error: true, message: 'Please provide datedebut' });
  }
  if (!datefin) {
    res.status(400).send({ error: true, message: 'Please provide datefin' });
  }
  if (!user_id) {
    res.status(400).send({ error: true, message: 'Please provide user_id' });
  }
  let sql_reporting=`SELECT d.* ,s.libelle,

  ( 
      TIMEDIFF(
    (SELECT o.created_at from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notificatio' ORDER BY o.id ASC LIMIT 1)	
    ,
    (SELECT i.created_at from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notificatio' ORDER BY i.id ASC LIMIT 1)	
    
       
    
    ) 
   ) AS DARR,
   
   
   ( 
      TIMEDIFF(
      (SELECT o.created_at from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notificatio'ORDER BY o.id ASC LIMIT  1,1),
        (SELECT i.created_at from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notificatio' ORDER BY i.id  ASC LIMIT 1)
      
    ) 
   ) AS DPRT,
   
    
  ( 
      TIMEDIFF(
    (SELECT o.created_at from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notificatio' ORDER BY o.id DESC LIMIT 1)	
    ,
    (SELECT i.created_at from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notificatio' ORDER BY i.id ASC LIMIT 1)		   	
    ) 
   ) AS TMTD
   
  FROM discussions d, discussion_status ds,status s,
       outputmessages omsg
        WHERE omsg.discussion_id=d.id and 
        ds.discussion_id=d.id and
        s.id=ds.status_id and
        d.is_open=0 and
        omsg.user_id in ${user_id} and 
       ( date(d.created_at) between ? and  ?)
  GROUP BY d.id`;
  dbconf.mysqlCon.query(sql_reporting, [ `${datedebut}`, `${datefin}`], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.status(200).json(results);
  });
}

exports.finDiscussion = (req, res) => {
  let discussion_id = req.params.id;
  if (!discussion_id) {
    return res.status(400).json({ error: true, message: 'Please provide discussion_id' });
  }
  dbconf.mysqlCon.query('SELECT * FROM discussions where id=?', discussion_id, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results[0]);
  });
}


