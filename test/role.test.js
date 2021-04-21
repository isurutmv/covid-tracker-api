const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();
const Role = require("../models/role");
const config = require('config');
const common = require("../static/static.json");

const header = {
    'x-api-key': config.get('api.key'),
    'x-api-secret': config.get('api.secret'),
    'Content-type': 'application/json',
    'Accept-Language': 'en-US',
};

chai.use(chaiHttp);
//Test - POST
describe("POST /role", () => {
    it("it return success message", (done) => {
        chai
            .request(server)
            .post(common.TEST_API_URL.ROLE)
            .set(header)
            .set('Authorization', config.get('test.authorization'))
            .send({
                name: "role from tdd",
                permissions: ["5f2125326aea915487c90db6", "5f212547cf306454f6351e77"],
            })
            .end((err, res) => {
                // if (err) done(err);
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

// //Test - GET (one)
it("should list a SINGLE role on /v1/role/<id> GET", done => {
    var newRole = new Role({
        name: "role from tdd",
        permissions: ["5f2125326aea915487c90db6", "5f212547cf306454f6351e77"],
    });
    newRole.save((err, data) => {
        chai
            .request(server)
            .get(common.TEST_API_URL.SINGLE_ROLE + data.id)
            .set(header)
            .set('Authorization', config.get('test.authorization'))
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a("object");
                res.body.data.should.have.property("_id");
                res.body.data.should.have.property("name");
                res.body.data.should.have.property("permissions");
                res.body.data.name.should.equal("role from tdd");
                // res.body.data.value.should.equal("test.test");
                res.body.data._id.should.equal(data.id);
                done();
            });
    });
});

// // Test - PUT
it("should update a SINGLE Role on /v1/Role/<id> PUT", done => {
    chai
        .request(server)
        .get("/v1/role")
        .set(header)
        .set('Authorization', config.get('test.authorization'))
        .end((err, res) => {
            chai
                .request(server)
                .put(common.TEST_API_URL.SINGLE_ROLE + res.body.data[0]._id)
                .set(header)
                .set('Authorization', config.get('test.authorization'))
                .send({name: "Spider"})
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

// // Test - DELETE
it("should delete a SINGLE Role on /v1/permission/<id> DELETE", done => {
    chai
        .request(server)
        .get("/v1/role")
        .set(header)
        .set('Authorization', config.get('test.authorization'))
        .end((err, res) => {
            chai
                .request(server)
                .delete(common.TEST_API_URL.SINGLE_ROLE + res.body.data[0]._id)
                .set(header)
                .set('Authorization', config.get('test.authorization'))
                .end((error, response) => {
                    response.should.have.status(200);
                    response.should.be.json;
                    done();
                });
        });
});
