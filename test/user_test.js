const assert = require('assert');
const request = require('supertest');
const app = require('../server').app;
const server = require('../server').server;
const chai = require('chai');

const { expect } = chai;
const should = require('chai').should();

describe("Restful controller", ()=>{
  after(function (done) {
    console.log("close server");
    server.close(done());
  });
  // add user
  it("POST to /addUser creates a new user", (done)=>{
    request(app)
      .post('/addUser')
      .send({userName: "testUser"})
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200);
        res.error.should.equal(false);
        done();
      })
  });
  // get user
  it("GET to /users finds users", (done)=>{
    request(app)
      .get("/users")
      .end((err, response) => {
        //Need to change to be dynamic.
        assert(response.body[0].name ==="testUser");
        done();
      });
  });

  //edit user name
  it("PUT to /edituser/:nameId to edit username", done=>{
    let agent = request(app);
    agent.get("/users").end((err, res)=>{
      agent.put(`/edituser/${res.body[0].userID}`)
        .send({user: "userTest"})
        .end((err, res)=>{
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        })
    })
  })

  // delete user
  it("DELETE to /deleteuser/:nameId", done=>{
    let agent = request(app);
    agent.get("/users").end((err, res)=>{
      agent.delete(`/deleteuser/${res.body[0].userID}`)
        .expect(200)
        .end((err, res)=>{
          res.status.should.equal(200);
          res.error.should.equal(false);
          done();
        })
    })
  })

})


