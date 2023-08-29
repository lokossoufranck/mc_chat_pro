const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require("../models/Users");
exports.signup =  (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(async (hash) => {
      console.log(hash);
      let user = req.body;
      console.log(user);
      if (!user) {
        res.status(400).send({ error: true, message: 'Please provide user' });
      }

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
      await usr.save().then((d) => {
        console.log('new user is added', d);
        res.status(200).json({ error: false, d, message: 'New user has been created successfully.' });
      }).catch((error) => {
        console.log(error);
      });

    }).catch(error => res.status(500).json({ error }));

}
/*
exports.logout = (req, res, next) => {
  let user_id = req.body.id;
  if (!user_id) {
    return res.status(400).json({ error: true, message: 'Please provide user_id' });
  }

  let = whereClause = { id: user_id };
  dbconf.mysqlCon.query(`UPDATE users SET is_on_line=0 ,updated_at=now() WHERE ? `, [whereClause], function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({ error: false, results, message: 'New user has been created successfully.' });
  });

}





//Update user
exports.updateUser = (req, res, next) => {
  if(req.body.password){
    let hash = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hash;
  }
  
  
  let user = req.body;
  let user_id = req.params.id;

  if (!user_id) {
    return res.status(400).json({ error: true, message: 'Please provide user_id' });
  }
  if (!user) {
    res.status(400).send({ error: true, message: 'Please provide user' });
  }
  
  let = whereClause = { id: user_id };
  dbconf.mysqlCon.query(`UPDATE users SET ? where ?`, [user, whereClause], function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({ error: false, results, message: 'resultat true' });
    
  });

}

exports.getAllUsers = (req, res, next) => {
  dbconf.mysqlCon.query('SELECT * FROM users', function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });
}


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


exports.signin = (req, res, next) => {
  let username = req.body.username;
  if (!username) {
    return res.status(400).json({ error: true, message: 'Entrer votre username' });
  }
  dbconf.mysqlCon.query('SELECT * FROM users where username=?', username, function (error, results, fields) {

    if (error) throw error;

    if (results[0]) {
      user = results[0];
      // console.log(user);
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: true, message: 'Mot de passe incorrect !' });
          }

          dbconf.mysqlCon.query('UPDATE users set is_on_line=1 where id=?', user.id, function (error, results, fields) {
            if (error) throw error;
            res.status(200).json(results[0]);
          });


          return res.status(200).json({
            userId: user.id,
            username: user.username,
            firstname: user.firstname,
            type_id: user.type_id,
            token: jwt.sign(
              {
                userId: user.id
              },
              'RANDOM_TOKEN_SECRET_MCB',
              { expiresIn: '24h' }
            )



          });
        }).catch(error => res.status(500).json({ error }));
    } else {
      return res.status(401).json({ error: true, message: 'incorrect username !' });
    }

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
