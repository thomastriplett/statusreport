const express = require('express');
const mysql = require('mysql');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
// const bcrypt = require('bcrypt');

// // Generate Admin password with salt !important DONT DELETE
// bcrypt.hash("PUTPASSWORD HERE", 10, (err, hash) => {
//   console.log(hash);
// });

// Database config
// Read more about pool
// https://github.com/mysqljs/mysql#pooling-connections
const pool = mysql.createPool({
  host: keys.host,
  user: keys.user,
  password: keys.password,
  database: keys.database,
  port: keys.port,
});

// Use pool connection to maintain a stable connection.
// wrapper: it replaces connection.query() with pooling
module.exports = {
  query() {
    let sql_args = [];
    const args = [];
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    const callback = args[args.length - 1]; // last arg is callback
    pool.getConnection((err, connection) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      if (args.length > 2) {
        sql_args = args[1];
      }
      connection.query(args[0], sql_args, (err, results) => {
        connection.release(); // always put connection back in pool after last query
        if (err) {
          console.log(err);
          return callback(err);
        }
        callback(null, results);
      });
    });
  },
};


const app = express();
// Middleware settings
app.use(express.json()); // application / json
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    // Send the error rather than to show it on the console
    res.status(401).send(err);
  } else {
    next(err);
  }
});

// routing settings
// login routes
require('./routes/login')(app);
// fetch data routes
require('./routes/fetch')(app);
// search related routes
require('./routes/search')(app);
// edit related routes
require('./routes/edit')(app);
// post related routes
require('./routes/post')(app);


// modify URL according to a hosting server url
// should be
// app.get('/statusreport/*', (req, res)
// if we don't deploy on a subfolder /statusreport
app.get('/statusreport/*', (req, res) => {
  const path = require('path');
  res.sendFile(path.join(__dirname, '/index.html'), err => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));

if(process.env.NODE_ENV === 'test'){
  // for test runner routes
  require('./test/testRoute')(app);
  module.exports = {app: app, server: server};
}