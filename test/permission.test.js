const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();
const Permission = require("../models/permissions");
const config = require("config");
const common = require("../static/static.json");

const header = {
  "x-api-key": config.get("api.key"),
  "x-api-secret": config.get("api.secret"),
  "Content-type": "application/json",
  "Accept-Language": "en-US",
};

chai.use(chaiHttp);
//Test - POST
describe("POST /permission", () => {
  it("it return success message", (done) => {
    chai
      .request(server)
      .post(common.TEST_API_URL.PERMISSION)
      .set(header)
      .set("Authorization", config.get("test.authorization"))
      .send({ name: "permission from tdd", value: "test.test" })
      .end((err, res) => {
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.be.a("boolean");
        res.body.success.should.equal(true);
        res.body.should.have.property("data");
        res.body.should.have.property("message");
        res.body.message.should.be.a("string");
        res.body.message.should.equal("SUCCESS");

        done();
      });
  });
});

//Test - GET (all)
describe("GET /permission", () => {
  it("it return All Permissions", (done) => {
    chai
      .request(server)
      .get(common.TEST_API_URL.PERMISSION)
      .set(header)
      .set("Authorization", config.get("test.authorization"))
      .send({ name: "permission from tdd", value: "test.test" })
      .end((err, res) => {
        // if (err) done(err);
        res.should.be.json;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success");
        res.body.success.should.be.a("boolean");
        res.body.success.should.equal(true);
        res.body.should.have.property("data");
        res.body.should.have.property("message");
        res.body.message.should.be.a("string");
        res.body.message.should.equal("SUCCESS");

        done();
      });
  });
});

//Test - GET (one)
it("should list a SINGLE Permission on /v1/permission/<id> GET", (done) => {
  var newPermission = new Permission({
    name: "Test Get",
    value: "test.test",
  });
  newPermission.save((err, data) => {
    chai
      .request(server)
      .get(common.TEST_API_URL.PERMISSION + data.id)
      .set(header)
      .set("Authorization", config.get("test.authorization"))
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a("object");
        res.body.data.should.have.property("_id");
        res.body.data.should.have.property("name");
        res.body.data.should.have.property("value");
        res.body.data.name.should.equal("Test Get");
        res.body.data.value.should.equal("test.test");
        res.body.data._id.should.equal(data.id);
        done();
      });
  });
});

// Test - PUT
it("should update a SINGLE Permission on /v1/permission/<id> PUT", (done) => {
  chai
    .request(server)
    .get(common.TEST_API_URL.PERMISSION)
    .set(header)
    .set("Authorization", config.get("test.authorization"))
    .end((err, res) => {
      chai
        .request(server)
        .put(common.TEST_API_URL.PERMISSION + res.body.data[0]._id)
        .set(header)
        .set("Authorization", config.get("test.authorization"))
        .send({ name: "Spider" })
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a("object");
          response.body.should.have.property("data");
          response.body.data.should.be.a("object");
          response.body.data.should.have.property("name");
          response.body.data.should.have.property("_id");
          response.body.data.name.should.equal("Spider");
          done();
        });
    });
});

// Test - DELETE
it("should delete a SINGLE Permission on /v1/permission/<id> DELETE", (done) => {
  chai
    .request(server)
    .get(common.TEST_API_URL.PERMISSION)
    .set(header)
    .set("Authorization", config.get("test.authorization"))
    .end((err, res) => {
      chai
        .request(server)
        .delete(common.TEST_API_URL.PERMISSION + "/" + res.body.data[0]._id)
        .set(header)
        .set("Authorization", config.get("test.authorization"))
        .send({ name: "Spider" })
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          done();
        });
    });
});
