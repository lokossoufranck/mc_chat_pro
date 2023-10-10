const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require("../models/Users");
var moment = require('moment'); // require
//moment().format('yyyy/mm/dd');
exports.signup = (req, res, next) => {


  bcrypt.hash(req.body.password, 10)
    .then(async (hash) => {
      let user = req.body;
      var errors = {}
      var message = {}

      var usr = new Users({
        'id': 0,
        'name': user.name,
        'firstname': user.firstname, // new discussion
        'email': user.email,
        'username': user.username,
        'password': hash,
        'is_on_line': false,
        'created_at': new Date()
      });

      if (usr.email == undefined) {
        // errors.email = 'Please provide email'
        return res.status(400).json({ error: true, message: 'Please provide email' });
      }
      if (usr.firstname == undefined) {
        //errors.firstname = 'Please provide firstname'
        return res.status(400).json({ error: true, message: 'Please provide firstname' });
      }
      if (usr.password == undefined) {
        return res.status(400).json({ error: true, message: 'Please provide password' });
      }

      await Users.findOne({ username: usr.username })
        .then(user => {
          return user;
        }).then(async (user) => {

          if (user == null) {// The user not exist in database           
            await usr.save().then((d) => {
              return res.status(200).json({ error: false, d, message: 'New user has been created successfully.' });
            }).catch((error) => {
              return res.status(200).json({ error: true, message: error });
            });

          } else {
            return res.status(200).json({ error: false, user, message: 'The user already exists in the database' });
          }
        })
        .catch(error => { console.log(error) })

    }).catch(error => res.status(500).json({ error }));


}


exports.signin = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username) {
    return res.status(400).json({ error: true, message: 'Entrer votre username' });
  }
  if (!password) {
    return res.status(400).json({ error: true, message: 'Entrer votre password' });
  }

  Users.findOne({ username: username }).then((user) => {
    return user;
  }).then((user) => {
    if (user != null) {
      bcrypt.compare(password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: true, message: 'Mot de passe incorrect !' });
        } else {
          let token = jwt.sign(
            {
              userId: user._id
            },
            'RANDOM_TOKEN_SECRET_MCB',
            { expiresIn: '24h' }
          )
          user.is_on_line = 1
          user.lastdate_connexion = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
          user.save();
          return res.status(401).json({ error: false, user, token, message: 'Connected user' });
        }
      }).catch(error => {
        return res.status(401).json({ error: true, message: error });
      })

    } else {
      return res.status(401).json({ error: true, message: 'This username not exist' });
    }

  })


}





exports.logout = (req, res, next) => {
  let user_id = req.body._id;
  if (!user_id) {
    return res.status(400).json({ error: true, message: 'Please provide user_id' });
  }
  Users.findOne({ _id: user_id }).then((user) => {
    if (user != null) {
      user.is_on_line = 0
      user.save();
      res.status(200).json({ error: false, user, message: 'User has been updated successfully.' });
    } else {
      res.status(401).json({ error: true, user, message: 'No user has not been found' });
    }

  })
}


//Update user
exports.updateUser = (req, res, next) => {
  let user_id = req.params.id;


  if (!user_id) {
    return res.status(400).json({ error: true, message: "Entrer votre l'id" });
  }


  Users.findOne({ _id: user_id }).then((user) => {
    return user;
  }).then((user) => {
    if (user != null) {
      user.is_on_line = req.body?.is_on_line ? req.body.is_on_line : user.is_on_line
      user.firstname = req.body?.firstname ? req.body.firstname : user.firstname
      user.email = req.body?.email ? req.body.email : user.email
      user.name = req.body?.name ? req.body.name : user.name
      if (req.body?.password != undefined) { // cheking if password is defined
        bcrypt.hash(req.body.password, 10)
          .then(async (hash) => {
            user.password = hash
            user.save()
          })
      }else
      user.save()
      return res.status(401).json({ error: false, user, message: 'Connected user' });
    } else {
      return res.status(401).json({ error: true, message: 'This username not exist' });
    }
  })

}


exports.getAllUsers = (req, res, next) => {
  Users.find().then((users) => {
    return res.status(401).json({ error: false, users, message: 'Connected user' });
  })
}

/*
exports.getUsersBy = (req, res, next) => {
  let user_id = req.body.user_id;
  if (!user_id) {
    res.status(400).send({ error: true, message: 'Please provide user_id' });
  }

  dbconf.mysqlCon.query('SELECT *, (CASE WHEN is_on_line = 0 THEN false else true END) as is_active FROM users where id = ?', user_id, function (error, results, fields) {
    if (error) throw error;
    if (results[0].type_id && results[0].type_id > 0) {
      dbconf.mysqlCon.query('SELECT * FROM users', function (error, results1, fields) {
        if (error) throw error;
        res.status(200).json(results1);
      });
    } else {
      dbconf.mysqlCon.query('SELECT * FROM users where id=?', user_id, function (error, results0, fields) {
        if (error) throw error;
        res.status(200).json(results0);
      });
    }
  });


}

exports.getAllUsersOnLine = (req, res, next) => {
  dbconf.mysqlCon.query("SELECT *, (CASE WHEN is_on_line = 0 THEN 'false' else 'true' END) as is_active FROM users where is_on_line=1", function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });
}
exports.getFirstUserInWaitingLine = (req, res, next) => {
  dbconf.mysqlCon.query('SELECT * FROM users where is_on_line=1 ORDER BY lastdate_attribution ASC limit 1', function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results[0]);
  });
}

exports.finUser = (req, res) => {
  let user_id = req.params.id;
  if (!user_id) {
    return res.status(400).json({ error: true, message: 'Please provide user_id' });
  }
  dbconf.mysqlCon.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results[0]);
  });

}



exports.getFirstUserOnline = (req, res, next) => {
  // Retourne la première personne en ligne
  dbconf.mysqlCon.query('SELECT * FROM users where is_on_line=1 ORDER BY 	lastdate_connexion ASC limit 1', function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results[0]);
  });
}
*/




exports.getFirstUserOnline = (req, res, next) => {
   Users.findOne({is_on_line:0}).sort({created_at:-1}).then((users) => {
    return res.status(200).json({ error: false, users, message: 'Connected user' });
  }).catch(error=>{
    return res.status(401).json({ error: false,message: error });
  })
}