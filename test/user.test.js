const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const config = require('config');
const should = chai.should();
const common = require("../static/static.json");

chai.use(chaiHttp);

const header = {
    'x-api-key': config.get('api.key'),
    'x-api-secret': config.get('api.secret'),
    'Content-type': 'application/json',
    'Accept-Language': 'en-US',
};

describe('POST /signUp', () => {
    it('it return boolean value, empty data object and string message', (done) => {
        chai.request(server)
            .post(common.TEST_API_URL.SIGN_UP)
            .set(header)
            .send({
                'name': 'unitTest',
                'email': 'unittest@gmail.com',
                'password': '123456789',
                'roleID': '["5f21a4afc1e18225522da497"]'
            })
            .end((err, res) => {
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.success.should.equal(true);
                res.body.should.have.property('data');
                res.body.data.should.equal({});
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('SUCCESS');
                done();
            })
    })
});


describe('POST /changePassword', () => {
    it('it return boolean value, empty data object and string message', (done) => {
        chai.request(server)
            .post(common.TEST_API_URL.CHANGE_PASSWORD)
            .set(header)
            .set('Authorization', config.get('test.authorization'))
            .send({"email": "nipun@keeneye.solutions", "oldPassword": "123456789", "newPassword": "secret@123"})
            .end((err, res) => {
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.success.should.equal(true);
                res.body.should.have.property('data');
                res.body.data.should.to.deep.equal({});
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('SUCCESS');
                done();
            })
    })
})

describe('POST /confirmForgetPassword', () => {
    it('it return boolean value, empty data object and string message', (done) => {
        chai.request(server)
            .post(common.TEST_API_URL.CONFIRM_FORGET_PASSWORD)
            .set(header)
            .set('Authorization', config.get('test.authorization'))
            .send({
                "email": "damitha@keeneye.us",
                "confirmationCode": 17061,
                "password": "123456789"
            })
            .end((err, res) => {
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.success.should.equal(true);
                res.body.should.have.property('data');
                res.body.data.name.should.be.a('string');
                res.body.data.name.should.equal('damitha');
                res.body.data.email.should.be.a('string');
                res.body.data.email.should.equal('damitha@keeneye.us');
                res.body.data.mobileNumber.should.be.a('string');
                res.body.data.mobileNumber.should.equal('+947790320056');
                res.body.data.id.should.be.a('string');
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('SUCCESS');
                done();
            })
    })
})

describe('GET /userDetails', () => {
    it('it return boolean value, object (object should have email, name, mobile number) and string message', (done) => {
        chai.request(server)
            .post(common.TEST_API_URL.PROFILE + "5f2d45b6795fbd1a38dd8595")
            .set(header)
            .set('Authorization', config.get('test.authorization'))
            .end((err, res) => {
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.success.should.equal(true);
                res.body.should.have.property('data');
                res.body.data.name.should.be.a('string');
                res.body.data.name.should.equal('damitha');
                res.body.data.email.should.be.a('string');
                res.body.data.email.should.equal('damitha@keeneye.us');
                res.body.data.mobileNumber.should.be.a('string');
                res.body.data.mobileNumber.should.equal('+947790320056');
                res.body.data.id.should.be.a('string');
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('SUCCESS');
                done();
            })
    })
})

describe('PUT /userDetails', () => {
    it('it return boolean value, empty object and string message', (done) => {
        chai.request(server)
            .put(common.TEST_API_URL.PROFILE + "5f2d45b6795fbd1a38dd8595")
            .set(header)
            .set('Authorization', config.get('test.authorization'))
            .send({
                "name": "damitha",
                "mobileNumber": "+985562302",
                "email": "damitha@keeneye.us",
                "oldPassword": "123456789",
                "newPassword": "123456789"
            })
            .end((err, res) => {
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.success.should.equal(true);
                res.body.should.have.property('data');
                res.body.data.should.to.deep.equal({})
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('PROFILE_UPDATED_SUCCESS');
                done();
            })
    })
})