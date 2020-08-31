
const conn = require('../models/index')
const User = require('../models/user');
const userController = require('../controllers/userController');
const app = require('../app');
const sinon = require('sinon');
const mocha = require('mocha');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const chai = require('chai');
const request = require('supertest');

describe('User Tests', () => {

    before(function (done) {
        this.timeout(10000);
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    after(function (done) {
        this.timeout(10000);
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    });

    describe('addUser', () => {

        after(async () => {
            await User.deleteOne({username: "tessagon"});
        })

        it('OK, creating new user works', (done) => {
            request(app).post('/user/signup')
                .send({
                    username: "tessagon",
                    email: "tessagon@tessagon.com",
                    password: "cold",
                    password2: "cold"
                })
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    /*afterEach(async () => {
        await User.remove({});
    });

    after(async () => {
        await mongoose.connection.close();
    });

    it('has a module', () => {
        expect(User).toBeDefined();
    })
    */

    /*describe("addUser", () => {
        it("add a user", async () => {

            const fake = sinon.fake();
            const req = mockRequest({}, {
                username: "tessagon",
                email: "tessagon@tessagon.com",
                password: "cold"
            });
            const res = mockResponse(fake);

            userController.addUser(req, res);
            const result = fake.lastArg;
            console.log(result);

            /*result.forEach(element => {
                expect(element).to.have.keys(["username", "email", "password"]);
            });
        });
    });*/

    /*describe("addUser", () => {
        it("should add a user, and redirct to logIn", (done) => {
            request(app)
                .post('/user/singup')
                .send({
                    username: "tessagon",
                    email: "tessagon@tessagon.com",
                    password: "cold"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });*/

});