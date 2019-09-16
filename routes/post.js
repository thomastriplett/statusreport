module.exports = app => {
  const connection = require('../server');
  // add new user to the database
  app.post('/addUser', (req, res) => {
    const { userName } = req.body;
    const sql = 'INSERT INTO `user` (name) VALUES (?)';
    const values = [userName];
    connection.query(sql, [values], (err, result) => {
      if (err) throw err;
      console.log(`new user is added ${result.affectedRows}`);
      res.sendStatus(200);
    });
  });

  // add new courseinfo to the database
  // used in App.js
  app.post('/addCourseinfo', (req, res) => {
    const program = req.body.program.toString().toUpperCase();
    const courseNumber = req.body.courseNumber.toString().toUpperCase();
    const { semesterTerm } = req.body;

    const sql = 'INSERT INTO `courseinfo` (program, courseNumber, semesterTerm) VALUES (?)';
    const values = [program, courseNumber, semesterTerm];

    connection.query(sql, [values], (err, result) => {
      if (err) throw err;
      console.log(`new courseinfo is added: ${result.affectedRows}`);
      console.log(program, ' and ', courseNumber);
    });
  });

  // post data, req.body graps all state data
  app.post('/submit', (req, res) => {
    // console.log(req.body.tasks);

    const tasks = req.body.tasks;
    const totalHours = req.body.totalHours; // int
    const date = req.body.date; // submit date (date type is string)
    //const requests = req.body.requestList;
    //const userName = req.body.userName; // userName
    const userID = req.body.userID;
    console.log(tasks);
    
    // requestList post
    /*Object.keys(requests).forEach(request => {
      const curRequest = requests[request];
      const sql =
        'INSERT INTO `requestList` (program, course, user, email, status) VALUES (?)';
      const values = [
        curRequest.program,
        curRequest.course,
        curRequest.user,
        curRequest.email,
        curRequest.status,
      ];
      connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log(`Number of records inserted: ${result.affectedRows}`);
      });
      console.log(values);
    });*/

    // coursetable or admintable post
    Object.keys(tasks).forEach(task => {
      if (tasks[task].taskType === 'Course Task') {
        // course task
        const curTask = tasks[task];
        const sql =
          'INSERT INTO `coursetable` (subDate, courseProgram, hours, courseTask, completionDate, courseInst, courseNumber, courseCat, semester, userID) VALUES (?)';
        const values = [
          date,
          curTask.program.toString().toUpperCase(),
          curTask.hours,
          curTask.courseType,
          curTask.date,
          curTask.instructor,
          curTask.courseNumber.toString().toUpperCase(),
          curTask.category,
          curTask.semester,
          userID,
        ];
        connection.query(sql, [values], (err, result) => {
          if (err) throw err;
          console.log(`Number of records inserted: ${result.affectedRows}`);
        });
        console.log(values);
      } else {
        // admin task
        const curTask = tasks[task];
        const sql =
          'INSERT INTO `admintable` (subDate, hours, adminCat, completionDate, userID) VALUES (?)';
        const values = [date, curTask.hours, curTask.category, curTask.date, userID,];
        connection.query(sql, [values], (err, result) => {
          if (err) throw err;
          console.log(`Number of records inserted: ${result.affectedRows}`);
        });
        console.log(values);
      }
    });
    // subDate Post: subdate, userID,
    const sqlSyntax = 'INSERT INTO `subDate` (subDate, userID, totalHours) VALUES (?)';
    const inputs = [date, userID, totalHours];
    connection.query(sqlSyntax, [inputs], (err, result) => {
      if (err) throw err;
      console.log(`subDate inserted: ${result.affectedRows}`);
    });
    console.log(inputs);
  });
};
