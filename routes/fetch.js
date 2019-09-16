// Fetch data
module.exports = app => {
  const connection = require('../server');
  app.get('/name', (req, res) => {
    connection.query('SELECT * FROM coursenaming ORDER BY program', (err, result) => {
      if (err) {
        console.log('Error in users query');
      } else {
        console.log('course naming query success');
        res.json(result);
      }
    });
  });

  app.get('/users', (req, res) => {
    connection.query('SELECT * FROM user ORDER BY admin DESC', (err, result) => {
      if (err) {
        console.log('Error in users query');
      } else {
        console.log('users query success');
        res.json(result);
      }
    });
  });

  app.get('/admintable', (req, res) => {
    connection.query('SELECT * FROM admintable', (err, result) => {
      if (err) {
        console.log('Error in admintable query');
      } else {
        console.log('admintable query success');
        res.json(result);
      }
    });
  });

  app.get('/coursetable', (req, res) => {
    connection.query('SELECT * FROM coursetable', (err, result) => {
      if (err) {
        console.log('Error in coursetable query');
      } else {
        console.log('coursetable query success');
        res.json(result);
      }
    });
  });

  app.get('/subDate', (req, res) => {
    connection.query('SELECT * FROM subDate', (err, result) => {
      if (err) {
        console.log('Error in subDate query');
      } else {
        console.log('subDate query success');
        res.json(result);
      }
    });
  });
  // courseinfo
  app.get('/courseinfo', (req, res) => {
    connection.query('SELECT * FROM courseinfo ORDER BY program', (err, result) => {
      if (err) {
        console.log('Error in courseinfo query');
      } else {
        console.log('courseinfo query success');
        res.json(result);
      }
    });
  });

  app.get('/request', (req, res) => {
    connection.query('SELECT * FROM requestList', (err, result) => {
      if (err) {
        console.log('Error in requestLists query');
      } else {
        console.log('requestLists query success');
        res.json(result);
      }
    });
  })
};
