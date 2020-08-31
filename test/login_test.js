
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
        console.log("closing");
        this.timeout(10000);
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    });

    describe('addUser', () => {

        after(async () => {
            await User.deleteOne({username: "tessagon"});
        })

        it('Should redirect to login page', (done) => {
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

    describe('login', () => {

        it('Should redirect to profile page', (done) => {
            request(app).post('/user/login')
                .send({username: 'dccol', password: 'cold'})
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal('/profile');
                    done();
                })
                .catch((err) => done(err));
        })
    })

    describe('logout', () => {

        it('Should redirect to login page', (done) => {
            request(app).get('/user/logout')
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal('/');
                    done();
                })
                .catch((err) => done(err));
        })
    })

});