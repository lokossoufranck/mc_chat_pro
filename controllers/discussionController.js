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
  dbconf.mysqlCon.query(`UPDATE discussions SET ? where ?`, [discussion, whereClause], function (error, results, fields) {
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
  let sql_reporting = `SELECT d.* ,s.libelle,
  u.username ,
  (case  when SUBSTRING(libelle,1,1)="D" then "DEMANDE" else "RECLAMATION"  end) AS TYPE_DEMANDE,
  ( SELECT DATE_FORMAT(i.created_at, '%T')  from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notification' ORDER BY i.id ASC LIMIT 1) AS HEURE_RECEPTION_PREMIER_MSG,

  IFNULL(
         (SELECT DATE_FORMAT(o.created_at, '%T') from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notification' ORDER BY o.id DESC LIMIT 1)	
    ,
         ( SELECT DATE_FORMAT(o.created_at, '%T')  from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notification'ORDER BY o.id ASC LIMIT  1,1) 
     
         ) AS HEURE_ENVOIE_PREMIERE_MSG,

    ( SELECT DATE_FORMAT(i.created_at, '%T')  from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notification' ORDER BY i.id ASC LIMIT 1) AS HEURE_DEMANDE,

--  ( SELECT DATE_FORMAT(o.created_at, '%T')  from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notification'ORDER BY o.id ASC LIMIT  1,1) AS HEURE_ENVOIE_PREMIERE_MSG,
--  ( SELECT DATE_FORMAT(i.created_at, '%T')  from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notification' ORDER BY i.id ASC LIMIT 1,1) AS HEURE_DEMANDE,
  ( SELECT DATE_FORMAT(o.created_at, '%T')  from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notification' ORDER BY o.id DESC LIMIT 1)	AS HEURE_CLOTURE,
  ( SELECT i.wp_number_sender from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notification' ORDER BY i.id ASC LIMIT 1) AS ABONNE,

  ( 
      TIMEDIFF(
    (SELECT o.created_at from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notification' ORDER BY o.id ASC LIMIT 1)	
    ,
    (SELECT i.created_at from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notification' ORDER BY i.id ASC LIMIT 1)	
    
       
    
    ) 
   ) AS DARR,
   
   
   ( 
		TIMEDIFF(

			IFNULL(
			 ( SELECT o.created_at  from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notification'ORDER BY o.id ASC LIMIT  1,1) 
				
		 ,
			 (SELECT o.created_at from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notification' ORDER BY o.id DESC LIMIT 1)
		  
			  ) 
		  ,
		  (SELECT i.created_at from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notification' ORDER BY i.id  ASC LIMIT 1)
		  
		) 
   ) AS DPRT,
   
    
  ( 
      TIMEDIFF(
    (SELECT o.created_at from outputmessages o WHERE o.discussion_id=d.id and o.type!='e2e_notification' ORDER BY o.id DESC LIMIT 1)	
    ,
    (SELECT i.created_at from inputmessages i WHERE i.discussion_id=d.id and i.type!='e2e_notification' ORDER BY i.id ASC LIMIT 1)		   	
    ) 
   ) AS TMTD
   
  FROM discussions d, discussion_status ds,status s,
       outputmessages omsg,users u
        WHERE omsg.discussion_id=d.id and 
        ds.discussion_id=d.id and
        s.id=ds.status_id and
        d.is_open=0 and
        u.id=omsg.user_id and
        omsg.user_id in ${user_id} and 
       ( date(d.created_at) between ? and  ?)
  GROUP BY d.id,s.id,u.id`;
  dbconf.mysqlCon.query(sql_reporting, [`${datedebut}`, `${datefin}`], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.status(200).json(results);
  });
}


exports.getReportGroupByQualification=(req,res,next)=>{
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
  let sql_reporting=`  SELECT R.status_id, R.libelle,count(*) nb from (
    SELECT d.*,s.id status_id, s.libelle 
    FROM discussions d, discussion_status ds,status s,
         outputmessages omsg,users u
          WHERE omsg.discussion_id=d.id and 
          ds.discussion_id=d.id and
          s.id=ds.status_id and
          d.is_open=0 and
          u.id=omsg.user_id and
          omsg.user_id in ${user_id} and 
         ( date(d.created_at) between ? and  ?)
    GROUP BY d.id,s.id,u.id ) R
    group by R.status_id order by nb desc`;
  dbconf.mysqlCon.query(sql_reporting, [`${datedebut}`, `${datefin}`], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.status(200).json(results);
  });
}



exports.getReportGroupByNumber=(req,res,next)=>{
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
  let sql_reporting=`  SELECT  R.wp_number_receiver,count(*) nb from (
    SELECT d.*,s.id status_id, s.libelle,omsg.wp_number_receiver
     
    FROM discussions d, discussion_status ds,status s,
         outputmessages omsg,users u
          WHERE omsg.discussion_id=d.id and 
          ds.discussion_id=d.id and
          s.id=ds.status_id and
          d.is_open=0 and
          u.id=omsg.user_id and
          omsg.user_id in ${user_id} and 
         ( date(d.created_at) between ? and  ?)
    GROUP BY d.id,s.id,u.id,omsg.wp_number_receiver ) R
    group by R.wp_number_receiver order by nb desc`;
  dbconf.mysqlCon.query(sql_reporting, [`${datedebut}`, `${datefin}`], function (error, results, fields) {
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
   /*
    res.status(200).json(results[0]); 
    
   */

  });
}


