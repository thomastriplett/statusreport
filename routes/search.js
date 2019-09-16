module.exports = app => {
  const connection = require('../server');
  // search by user (coursetble)
  app.get('/search/coursetable/:userID/:startDate/:endDate', (req, res) => {
    console.log(req.params.userID);
    console.log(req.params.startDate);
    console.log(req.params.endDate);

    const { userID, startDate, endDate } = req.params;

    connection.query(
      `SELECT * FROM coursetable
    WHERE completionDate BETWEEN '${startDate}' AND '${endDate}'
    AND userID='${userID}'`,
      (err, result) => {
        if (err) {
          console.log('Error in coursetable query');
        } else {
          console.log(result);
          res.json(result);
        }
      }
    );
  });

  // search by user (admintable)
  app.get('/search/admintable/:userID/:startDate/:endDate/', (req, res) => {
    const { userID, startDate, endDate } = req.params;
    connection.query(
      `SELECT * FROM admintable
    WHERE completionDate BETWEEN '${startDate}' AND '${endDate}'
    AND userID='${userID}'`,
      (err, result) => {
        if (err) {
          console.log('Error in admintable query');
        } else {
          console.log(result);
          res.json(result);
        }
      }
    );
  });

  // search by user (program name)
  app.get('/search/program/:courseProgram/:startDate/:endDate/:courseTypeValue/:idList1/:nameList1/', (req, res) => {
    console.log('program search start: ')
    const { courseProgram, startDate, endDate, courseTypeValue, idList1, nameList1 } = req.params;
    // convert the regex arrays into properly parsed arrays
    const stringList = idList1.toString();
    const stringList2 = nameList1.toString();
    const idList = stringList.split(",");
    const nameList = stringList2.split(",");

    if(courseProgram === 'All'){
      connection.query(
        `SELECT * FROM coursetable
      WHERE completionDate BETWEEN '${startDate}' AND '${endDate}'`,
        (err, result) => {
          if (err) {
            console.log('Error in program(name) query');
          } else {
            console.log(result);
            // combine identical submissions
            for(var curr of result){
              for(i = result.indexOf(curr)+1; i < result.length; i++){
                var curr2 = result[i];
                if(curr != null && curr2 != null){
                  if(curr.userID == curr2.userID && curr.courseNumber == curr2.courseNumber && curr.courseCat == curr2.courseCat){
                    curr.hours += curr2.hours;
                    delete result[i];
                  }
                }
              }
            }

            result = result.filter(function(element) {
              return element !== undefined;
            });

            // change userID to username
            for(var curr of result){
              for (i = 0; i < idList.length; i++) {
                if(curr.userID == idList[i]){
                  console.log("User ID: "+ curr.userID + " is " + nameList[i]);
                  curr.userID = nameList[i];
                }
              }
            }

            //create workbook
            var XLSX = require('xlsx');
            var wb = XLSX.utils.book_new();

            // create worksheet
            var ws = XLSX.utils.aoa_to_sheet([['Name','Program','Course number','Course task','Semester','Instructor','Course category','Report date','Completion date','Hours']]);
            
            // input results into Excel file
            for(var curr of result){
              XLSX.utils.sheet_add_aoa(ws, [[curr.userID,curr.courseProgram,curr.courseNumber,curr.courseTask,curr.semester,curr.courseInst,curr.courseCat,curr.subDate,curr.completionDate,curr.hours]], {origin: -1});
            }

            // add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Weekly Report');

            // save the Excel file
            result.push(wb);
            
            console.log(result);
            res.send(result);
          }
        }
      );
    }

    else if(courseTypeValue === 'All'){
      connection.query(
        `SELECT * FROM coursetable
      WHERE completionDate BETWEEN '${startDate}' AND '${endDate}'
      AND courseProgram='${courseProgram}'`,
        (err, result) => {
          if (err) {
            console.log('Error in program(name) query');
          } else {
            console.log(result);
            for(var curr of result){
              for (i = 0; i < idList.length; i++) {
                if(curr.userID == idList[i]){
                  console.log("User ID: "+ curr.userID + " is " + nameList[i]);
                  curr.userID = nameList[i];
                }
              }
            }
            console.log(result);
            res.send(result);
          }
        }
      );
    }else{
      connection.query(
        `SELECT * FROM coursetable
      WHERE completionDate BETWEEN '${startDate}' AND '${endDate}'
      AND courseProgram='${courseProgram}' AND courseTask='${courseTypeValue}'`,
        (err, result) => {
          if (err) {
            console.log('Error in program(name) query');
          } else {
            console.log(result);
            for(var curr of result){
              for (i = 0; i < idList.length; i++) {
                if(curr.userID == idList[i]){
                  console.log("User ID: "+ curr.userID + " is " + nameList[i]);
                  curr.userID = nameList[i];
                }
              }
            }
            res.send(result);
          }
        }
      );
    }
  });

  // search by user (program number)
  app.get('/search/programNumber/:courseNumber/:startDate/:endDate/:courseTypeValue/:idList1/:nameList1', (req, res) => {
    console.log('program Number search start: ');
    console.log(req.params.courseNumber);
    console.log(req.params.startDate);
    console.log(req.params.endDate);
    const { courseNumber, startDate, endDate, courseTypeValue, idList1, nameList1} = req.params;
    // convert the regex arrays into properly parsed arrays
    const stringList = idList1.toString();
    const stringList2 = nameList1.toString();
    const idList = stringList.split(",");
    const nameList = stringList2.split(",");

    if(courseTypeValue === 'All'){
      connection.query(
        `SELECT * FROM coursetable
        WHERE completionDate BETWEEN '${startDate}' AND '${endDate}'
        AND courseNumber='${courseNumber}'`,
        (err, result) => {
          if (err) {
            console.log('Error in program(number) query');
          } else {
            console.log(result);
            for(var curr of result){
              for (i = 0; i < idList.length; i++) {
                if(curr.userID == idList[i]){
                  console.log("User ID: "+ curr.userID + " is " + nameList[i]);
                  curr.userID = nameList[i];
                }
              }
            }
            res.json(result);
          }
        }
      );
    }else{
      connection.query(
        `SELECT * FROM coursetable
        WHERE completionDate BETWEEN '${startDate}' AND '${endDate}'
        AND courseNumber='${courseNumber}' AND courseTask='${courseTypeValue}'`,
        (err, result) => {
          if (err) {
            console.log('Error in program(number) query');
          } else {
            console.log(result);
            for(var curr of result){
              for (i = 0; i < idList.length; i++) {
                if(curr.userID == idList[i]){
                  console.log("User ID: "+ curr.userID + " is " + nameList[i]);
                  curr.userID = nameList[i];
                }
              }
            }
            res.json(result);
          }
        }
      );
    }
  });

  // Search course info
  app.get('/search/courseinfo', (req, res) => {
    connection.query('SELECT DISTINCT program, courseNumber FROM courseinfo', (err, result) => {
      if (err) {
        console.log('Error in courseinfo query');
      } else {
        console.log('courseinfo query success');
        res.json(result);
      }
    });
  });
};
