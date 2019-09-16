const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");

const connection = mysql.createConnection({
  host: "eipd.dcs.wisc.edu",
  user: "eipd_SR17",

  port: 3306
});
connection.connect(function(err) {
  if (err) {
    console.log("Fail to Connect!");
  } else {
    console.log("Connected!");
  }
});

const app = express();
app.use(bodyParser.json()); //application / json
app.use(bodyParser.urlencoded({ extended: true }));
//fetch data; we might not need to fetch all data
app.get("/users", (req, res) => {
  connection.query("SELECT * FROM user", function(err, result, fields) {
    if (err) {
      console.log("Error in users query");
    } else {
      console.log("success");
      res.json(result);
    }
  });
});
app.get("/admintable", (req, res) => {
  connection.query("SELECT * FROM admintable", function(err, result, fields) {
    if (err) {
      console.log("Error in admintable query");
    } else {
      console.log("success");
      res.json(result);
    }
  });
});
app.get("/coursetable", (req, res) => {
  connection.query("SELECT * FROM coursetable", function(err, result, fields) {
    if (err) {
      console.log("Error in coursetable query");
    } else {
      console.log("success");
      res.json(result);
    }
  });
});

//post data, req.body graps all state data
app.post("/submit", (req, res) => {
  //console.log(req.body.tasks);
  const tasks = req.body.tasks; //json; need to parse this
  const totalHours = req.body.totalHours; //int
  const date = req.body.date; //date type is string
  console.log(tasks);
  // Tasks post
  for (let task in tasks) {
    if (tasks[task].taskType === "Course Task") {
      //course task
      const curTask = tasks[task];
      const sql =
        "INSERT INTO `coursetable` (courseProgram, hours, courseTask, completionDate, courseInst, courseCat) VALUES (?)";
      const values = [
        curTask.program,
        curTask.hours,
        curTask.courseType,
        curTask.date,
        curTask.instructor,
        curTask.category
      ];
      connection.query(sql, [values], function(err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      });
      console.log(values);
    } else {
      //admin task
      const curTask = tasks[task];
      const sql =
        "INSERT INTO `admintable` (hours, adminCat, completionDate) VALUES (?)";
      const values = [curTask.hours, curTask.category, curTask.date];
      connection.query(sql, [values], function(err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      });
      console.log(values);
    }
  }
  // User post

  //need to be changed after parsing the data
  connection.query(
    "INSERT INTO `coursetable` (CompletionDate) VALUES (?)",
    date,
    function(err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    }
  );
});

const port = 5000;
app.listen(port, () => `Server running on port ${port}`);
