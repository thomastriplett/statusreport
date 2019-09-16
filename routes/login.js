const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

const jwtMW = exjwt({
  secret: 'keyboard cat 4 ever',
});
// LOGIN ROUTE
module.exports = app => {
  const connection = require('../server');

  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM user WHERE name = ?', [username], (err, result) => {
      //console.log(result[0].password, password);
      if (err) {
        res.send({
          code: 400,
          failed: 'error ocurred',
        });
      } else if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (err, match) => {
          if (match) {
            console.log("passwords match");
            // if (result[0].password === password) {
            const token = jwt.sign(
              { id: result[0].id, username: result[0].name },
              'keyboard cat 4 ever',
              { expiresIn: 129600 }
            ); // Sigining the token
            res.json({
              success: true,
              err: null,
              token,
            });
          }else if(password == result[0].password && !match){
            bcrypt.hash(password, 10, (err, hash) => {
              connection.query(
                'UPDATE user SET ? WHERE name = ?',
                [{ password: hash }, username],
                (err, result) => {
                  if (err) throw err;
                  console.log(
                    "Successed to change the password"
                  );
                }
              );
              //res.sendStatus(200);
            });
            const token = jwt.sign(
              { id: result[0].id, username: result[0].name },
              'keyboard cat 4 ever',
              { expiresIn: 129600 }
            ); // Sigining the token
            res.json({
              success: true,
              err: null,
              token,
            });
          } 
          else {
            //password is incorrect
            res.status(401).json({
              success: false,
              token: null,
              err: username+ " "+password+" "+result[0].username+" "+result[0].password,
              //'Username or password is incorrect',
            });
          }
        });
      } else {
        // username AND/OR password is incorrect
        res.status(401).json({
          success: false,
          token: null,
          err: 'Username or password is incorrect',
        });
      }
    });
  });

  app.get('/', jwtMW /* Using the express jwt MW here */, (req, res) => {
    res.send('You are authenticated'); // Sending some response when authenticated
  });

  // change password, create a new salted password
  app.put('/changepassword', (req, res) => {
    // // Generate Admin password with salt !important DONT DELETE
    const name = req.body.username;

    bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
      connection.query(
        'UPDATE user SET ? WHERE name = ?',
        [{ password: hash }, name],
        (err, result) => {
          if (err) throw err;
          console.log(
            "Successed to change the password"
          );
        }
      );
      res.sendStatus(200);
    });
  });
};