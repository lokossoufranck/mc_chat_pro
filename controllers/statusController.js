const dbconf = require("../dbconf");
const bcrypt = require("bcrypt");

exports.getAllStatus = (req, res, next) => {
  dbconf.mysqlCon.query(
    "SELECT * FROM status WHERE is_delete=false ",
    function (error, results, fields) {
      if (error) throw error;
      res.status(200).json(results);
    }
  );
};










