const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
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

describe('POST /login', () => {
    it('it return access token, refresh token and user object', (done) => {
        chai.request(server)
            .post(common.TEST_API_URL.LOGIN)
            .set(header)
            .send({'email': 'damitha@gmail.com', 'password': '123456789'})
            .end((err, res) => {
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.success.should.equal(true);
                res.body.should.have.property('data');
                res.body.data.should.have.property('accessToken');
                res.body.data.accessToken.should.be.a('string');
                res.body.data.should.have.property('refreshToken');
                res.body.data.accessToken.should.be.a('string');
                res.body.data.roleID.should.be.a('array');
                res.body.data.name.should.be.a('string');
                res.body.data.email.should.be.a('string');
                res.body.data.id.should.be.a('string');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('SUCCESS');
                done();
            })
    })
})

describe('POST /refreshToken', () => {
    it('it new access token', (done) => {
        chai.request(server)
            .post(common.TEST_API_URL.REFRESH_TOKEN)
            .set(header)
            .send({'refreshToken': config.get('test.refreshToken')})
            .end((err, res) => {
                // if (err) done(err);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.be.a('boolean');
                res.body.success.should.equal(true);
                res.body.should.have.property('data');
                res.body.data.should.have.property('accessToken');
                res.body.data.accessToken.should.be.a('string');
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.a('string');
                res.body.message.should.equal('SUCCESS');
                done();
            })
    })
})
