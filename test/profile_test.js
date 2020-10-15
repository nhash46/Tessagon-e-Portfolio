'use strict';
const conn = require('../models/index')
const User = require('../models/user');
const Blog = require('../models/blog');
const userController = require('../controllers/userController');
const blogController = require('../controllers/blogController');
const app = require('../app');
const sinon = require('sinon');
const mocha = require('mocha');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const chai = require('chai');
const request = require('supertest');
let session = require('supertest-session');
let testSession = null;

describe('Profile Tests', () => {

    /*before(function (done) {
        this.timeout(10000);
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    });*/
    

    let authenticatedSession;
    beforeEach(function (done) {
        testSession = session(app);
        testSession.post('/user/login')
            .send({ username: 'dccol', password: 'cold' })
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
                //var user = request(app).get('/user/profile');
                //console.log(user.username);
                authenticatedSession = testSession;
                return done();
        });
    });

    /*after(function (done) {
        this.timeout(10000);
        conn.close()
            .then(() => done())
            .catch((err) => done(err));
    });*/

    describe("Get current user's profile page (restricted)", () => {

        it('should get a restricted page', function (done) {
            authenticatedSession.get('/user/profile')
              .expect(200)
              .end(done)
          });
    });

    describe('Edit contanct info', () => {

        it("should update contact information and redirect to profile", (done) => {
            authenticatedSession.post('/editNavInfo')
                .send({ 
                    phone_number: '0412 345 678', 
                    city: 'Melbourne' ,
                    state: 'Victoria', 
                    email: 'tessagon@tessagon123.com'
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('Edit home info', () => {

        it("should update home section and redirect to profile", (done) => {
            authenticatedSession.post('/editHomeInfo')
                .send({ 
                    first_name: 'Tess', 
                    last_name: 'Agon'
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('Edit about me info', () => {

        it("should update about me section and redirect to profile", (done) => {
            authenticatedSession.post('/editAboutMe')
                .send({ 
                    bio: 'This is a new bio', 
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

});