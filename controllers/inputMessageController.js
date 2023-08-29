const dbconf = require("../dbconf");
const bcrypt = require("bcrypt");

//Update inputmessage
exports.updateInputMessage = (req, res, next) => {
  let inputmessage = req.body;
  let inputmessage_id = req.params.id;
  if (!inputmessage_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide inputmessage_id" });
  }
  if (!inputmessage) {
    res
      .status(400)
      .send({ error: true, message: "Please provide inputmessage" });
  }
  let = whereClause = { id: inputmessage_id };
  dbconf.mysqlCon.query(
    `UPDATE inputmessages SET ?`,
    [inputmessage, whereClause],
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        error: false,
        results,
        message: "New inputmessage has been created successfully.",
      });
    }
  );
};
exports.getAllInputMessages = (req, res, next) => {
  dbconf.mysqlCon.query(
    "SELECT * FROM inputmessages",
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    }
  );
};
/*
exports.getLatestInputmessages = (req, res, next) => {
  let user_id = req.body.user_id;

  if (!user_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide user_id" });
  }

  dbconf.mysqlCon.query(
    `SELECT * , (SELECT COUNT(*) FROM inputmessages im where im.is_read=0 and im.subcriber_id=m.subcriber_id) news_msg_count
FROM inputmessages m
WHERE id = (SELECT MAX(id) FROM inputmessages WHERE  m.wp_number_sender = wp_number_sender)
     AND discussion_id in (select discussion_id from outputmessages where user_id=?)
ORDER BY m.id DESC`,
    user_id,
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    }
  );
};
*/

exports.getLatestInputmessages = (req, res, next) => {
  let user_id = req.body.user_id;

  if (!user_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide user_id" });
  }

  dbconf.mysqlCon.query(
    `SELECT
      im.id,
      ou.user_id,
      im.wp_number_sender,
      im.wp_number_receiver,
      im.discussion_id,
      im.subcriber_id,
      d.etat,
      d.is_open,
      (
      SELECT
          COUNT(*)
      FROM
          inputmessages i
      WHERE
          i.is_read = 0 AND i.subcriber_id = im.subcriber_id
  ) news_msg_count,
  (
      CASE WHEN(
      SELECT
          created_at
      FROM
          outputmessages
      WHERE
          discussion_id = im.discussion_id
      ORDER BY
          id
      DESC
  LIMIT 1
  ) < im.created_at THEN im.body ELSE(
      SELECT
          body
      FROM
          outputmessages
      WHERE
          discussion_id = im.discussion_id
      ORDER BY
          id
      DESC
  LIMIT 1
  )
  END
  ) AS body,
  (
      CASE WHEN(
      SELECT
          created_at
      FROM
          outputmessages
      WHERE
          discussion_id = im.discussion_id
      ORDER BY
          id
      DESC
  LIMIT 1
  ) < im.created_at THEN im.filename ELSE(
      SELECT
          filename
      FROM
          outputmessages
      WHERE
          discussion_id = im.discussion_id
      ORDER BY
          id
      DESC
  LIMIT 1
  )
  END
  ) AS filename
  
  
  ,
  (
      CASE WHEN(
      SELECT
          created_at
      FROM
          outputmessages
      WHERE
          discussion_id = im.discussion_id
      ORDER BY
          id
      DESC
  LIMIT 1
  ) < im.created_at THEN im.created_at ELSE(
      SELECT
          created_at
      FROM
          outputmessages
      WHERE
          discussion_id = im.discussion_id
      ORDER BY
          id
      DESC
  LIMIT 1
  )
  END
  ) AS created_at
  FROM
      inputmessages im,
      outputmessages ou,
      discussions d
  WHERE
      d.id = im.discussion_id AND ou.discussion_id = im.discussion_id AND d.is_open = 1 AND im.id IN(
      SELECT
          MAX(i.id)
      FROM
          inputmessages i,
          outputmessages o,
          discussions di
      WHERE
          di.id = i.discussion_id AND o.discussion_id = i.discussion_id AND o.user_id = ?
      GROUP BY
          i.wp_number_sender
  )
  GROUP BY
      d.id,  ou.user_id,im.id
      order by created_at desc
      `,
    user_id,
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    }
  );
};

exports.getAllInputMessagesOnLine = (req, res, next) => {
  dbconf.mysqlCon.query(
    "SELECT * FROM inputmessages where is_on_line=1",
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    }
  );
};
exports.finInputMessage = (req, res) => {
  let inputmessage_id = req.params.id;
  if (!inputmessage_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide inputmessage_id" });
  }
  dbconf.mysqlCon.query(
    "SELECT * FROM inputmessages where id=?",
    inputmessage_id,
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results[0]);
    }
  );
};
exports.getFirstInputMessageOnline = (req, res, next) => {
  // Retourne la première personne en ligne
  dbconf.mysqlCon.query(
    "SELECT * FROM inputmessages where is_on_line=1 ORDER BY 	lastdate_connexion ASC limit 1",
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results[0]);
    }
  );
};

exports.getInputMessagesBySubcriber = (req, res, next) => {
  // Retourne le message précedent
  let subcriber_id = req.body.subcriber_id;
  if (!subcriber_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide subcriber_id" });
  }
  dbconf.mysqlCon.query(
    "SELECT *, 1 as col FROM inputmessages where subcriber_id=? ORDER BY id DESC ",
    subcriber_id,
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    }
  );
};

exports.readMessagesBySubcriber = (req, res, next) => {
  // Retourne le message précedent
  let subcriber_id = req.body.subcriber_id;
  if (!subcriber_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide subcriber_id" });
  }
  dbconf.mysqlCon.query(
    "UPDATE inputmessages set is_read=1 where subcriber_id=?",
    subcriber_id,
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    }
  );
};

exports.getMessagesBySubcriber = (req, res, next) => {
  // Retourne le message précedent
  let wp_number_sender = req.body.wp_number_sender;
  if (!wp_number_sender) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide wp_number_sender" });
  }
  dbconf.mysqlCon.query(
    `select * from (SELECT i.id,i.body,i.type,i.filename,i.mimetype,i.length,i.has_media,i.wp_number_sender,i.wp_number_receiver,i.discussion_id, d.etat, d.is_open, i.is_read,i.created_at, 1 as sender, s.name as name FROM inputmessages i,subcribers s,discussions d WHERE i.subcriber_id=s.id AND d.id=i.discussion_id AND i.wp_number_sender=?
UNION
SELECT 
o.id,o.body,o.type,o.filename,o.mimetype,o.length,o.has_media,o.wp_number_sender,o.wp_number_receiver,o.discussion_id,d.etat, d.is_open, o.is_read,o.created_at, 0 as sender, u.name as name
 FROM outputmessages o, users u,discussions d WHERE o.user_id=u.id AND d.id=o.discussion_id AND  o.wp_number_receiver=?) as t ORDER by created_at asc`,
    [`${wp_number_sender}`, `${wp_number_sender}`],
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    }
  );
};

