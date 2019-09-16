module.exports = app => {
  const connection = require('../server');
  // naming guide edit start ...
  app.put('/editname/:nameId', (req, res) => {
    const nameId = req.params.nameId;
    console.log('courseID: ', nameId);
    connection.query(
      'UPDATE coursenaming SET ? WHERE ID = ?',
      [{ program: req.body.program, course: req.body.course }, nameId],
      (err, result) => {
        if (err) throw err;
        console.log(
          'new program name: ',
          req.body.program,
          ' new course name: ',
          req.body.course,
          'are updated.'
        );
      }
    );
    res.sendStatus(200);
  });

  app.post('/addnewcoursenaming', (req, res) => {
    const sql = 'INSERT INTO `coursenaming` (program, course) VALUES (?)';
    const values = [req.body.program, req.body.course];

    connection.query(sql, [values], (err, result) => {
      if (err) throw err;
      console.log(`new coursename is added: ${result.affectedRows}`);
      console.log(req.body.program, ' and ', req.body.course);
    });
    res.sendStatus(200);
  });
  app.delete('/deletename/:nameId', (req, res) => {
    console.log('courseID: ', req.params.nameId);
    connection.query('DELETE FROM coursenaming WHERE ID= ?', [req.params.nameId], (err, result) => {
      if (err) throw err;
      console.log('deleted.');
    });
    res.sendStatus(200);
  });
  // naming guide edit end...

  // courseinfo edit start...
  app.post('/addnewcourseinfo', (req, res) => {
    const sql = 'INSERT INTO `courseinfo` (program, courseNumber) VALUES (?)';
    const values = [req.body.program, req.body.course];

    connection.query(sql, [values], (err, result) => {
      if (err) throw err;
      console.log(`new coursename is added: ${result.affectedRows}`);
      console.log(req.body.program, ' and ', req.body.course);
    });

    res.sendStatus(200);
  });

  app.delete('/deletecourseinfo/:nameId', (req, res) => {
    console.log('courseID: ', req.params.nameId);
    connection.query('DELETE FROM courseinfo WHERE ID= ?', [req.params.nameId], (err, result) => {
      if (err) throw err;
      console.log('deleted.');
    });
    res.sendStatus(200);
  });

  app.put('/editcourseinfo/:nameId', (req, res) => {
    const nameId = req.params.nameId;
    console.log('courseID: ', nameId);
    connection.query(
      'UPDATE courseinfo SET ? WHERE ID = ?',
      [{ program: req.body.program, courseNumber: req.body.course }, nameId],
      (err, result) => {
        if (err) throw err;
        console.log(
          'new program name: ',
          req.body.program,
          ' new course name: ',
          req.body.course,
          'are updated.'
        );
      }
    );
    res.sendStatus(200);
  });
  // courseinfo edit end...

  // user edit start...
  app.post('/addnewuser', (req, res) => {
    const sql = 'INSERT INTO `user` (name) VALUES (?)';
    const values = [req.body.user];

    connection.query(sql, [values], (err, result) => {
      if (err) throw err;
      console.log(`new coursename is added: ${result.affectedRows}`);
      console.log(req.body.program, ' and ', req.body.course);
      res.sendStatus(200);
    });
  });

  app.delete('/deleteuser/:nameId', (req, res) => {
    connection.query('DELETE FROM user WHERE userID= ?', [req.params.nameId], (err, result) => {
      if (err)throw err;
      //delete nothing
      if(result.affectedRows === 0){
        res.sendStatus(204);
      }else{
        console.log('deleted.');
        res.sendStatus(200);
      }
    });
  });

  app.put('/edituser/:nameId', (req, res) => {
    const nameId = req.params.nameId;
    connection.query(
      'UPDATE user SET ? WHERE userID = ?',
      [{ name: req.body.user }, nameId],
      (err, result) => {
        if (err) throw err;
        console.log('new user name: ', req.body.user);
      }
    );
    res.send(req.body.user);
    res.sendStatus(200);
  });
  // user edit end...
};
