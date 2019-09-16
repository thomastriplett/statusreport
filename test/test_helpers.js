const request = require('supertest');
const app = require('../server').app;
before(()=>{
  // clean the data before the test
  request(app)
    .delete('/deleteUsers')
    .expect(200)
    .end((err, res) => {
    }
  );
  console.log("test start");
})