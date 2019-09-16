module.exports = app => {
  const connection = require('../server');
  app.delete('/deleteUsers', (res, req)=>{
    connection.query('DELETE FROM user',(err, result)=>{
      if (err) throw err;
      console.log('delete all users');
    });
    res.sendStatus(200);
  });
}