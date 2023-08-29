const dbconf = require("../dbconf");
const db = require('../sequelize_config_database');
const { QueryTypes } = require('sequelize');
const DiscussionModel = require("../models/Discussion");
const DiscussionStatusModel = require("../models/DiscussionStatus");



exports.create = async (req, res, next) => {

  let ds = req.body;
  if (!ds.discussion_id) {
    res.status(400).send({ error: true, message: 'Please provide discussion_id' });
  }

  if (!ds.user_id) {
    res.status(400).send({ error: true, message: 'Please provide user_id' });
  }

  if (!ds.status_id) {
    res.status(400).send({ error: true, message: 'Please provide status_id' });
  }
  if (ds.discussion_id && ds.user_id && ds.status_id) {

    var sql_msg = "CALL  statuer(:discussion_id,:user_id,:status_id,@discussion_status_id);";
    var query = sql_msg;
    const results =  await db.query(query,
      {
        replacements:
        {
          discussion_id: ds.discussion_id,
          user_id: ds.user_id,
          status_id: ds.status_id,
        },
        multipleStatements: true,
        type: QueryTypes.SELECT
      });
    //console.log(results);
    res.status(200).json({ error: false, results, message: 'New status has been created successfully.' });


    /* dbconf.mysqlCon.query(`INSERT INTO discussion_status( discussion_id, user_id,status_id, created_at) 
 VALUES (?,?,?,now())`, [`${ds.discussion_id}`, `${ds.user_id}`, `${ds.status_id}`], function (error, results, fields) {
       if (error) throw error;
       res.status(200).json({ error: false, results, message: 'New status has been created successfully.' });
     });*/
  }
}



exports.update = (req, res, next) => {
  let ds = req.body;
  let id = req.params.id;

  if (!id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide id of discussion_status" });
  }

  if (!ds.discussion_id) {
    res
      .status(400)
      .send({ error: true, message: "Please provide discussion_id" });
  }

  if (!ds.user_id) {
    res
      .status(400)
      .send({ error: true, message: "Please provide user_id" });
  }
  if (!ds.status_id) {
    res
      .status(400)
      .send({ error: true, message: "Please provide status_id" });
  }


  let = whereClause = { id: id };
  dbconf.mysqlCon.query(
    `UPDATE discussion_status SET ?`,
    [ds, whereClause],
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json({
        error: false,
        results,
        message: "New status has been created successfully.",
      });
    }
  );
};



exports.find = (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide id" });
  }

  dbconf.mysqlCon.query(
    "SELECT * FROM discussion_status where id=?",
    id,
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results[0]);
    }
  );
};

exports.getLast = (req, res, next) => {
  let discussion_id = req.params.discussion_id;
  if (!discussion_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide id" });
  }
  dbconf.mysqlCon.query(
    "SELECT discussion_status.*,users.username FROM discussion_status,users where users.id= discussion_status.user_id and discussion_id=? ORDER BY  id DESC limit 1",
    discussion_id,
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results[0]);
    }
  );
};


exports.getStatusByDiscussion = (req, res, next) => {

  let discussion_id = req.params.discussion_id;
  if (!discussion_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide discussion_id" });
  } else {
    dbconf.mysqlCon.query(
      "SELECT discussion_status.*,users.username FROM discussion_status,users where users.id= discussion_status.user_id and discussion_id=?",
      discussion_id,
      function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
      }
    );

  }


};