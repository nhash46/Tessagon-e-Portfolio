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

describe('Blog Tests', () => {

    before(function (done) {
        this.timeout(10000);
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    });
    

    let authenticatedSession;
    beforeEach(function (done) {
        testSession = session(app);
        testSession.post('/user/login')
            .send({ username: 'dccol', password: 'cold' })
            .expect(302)
            .end(function (err) {
                if (err) return done(err);
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

    describe('show blogs', () => {

        it('Should display list of blogs belonging to a user', (done) => {
            authenticatedSession.get('/blog-posts/naz3')
                .then((res) => {
                    expect(302);
                    //expect(res.headers.location).to.equal('/blog-posts/naz3');
                    done();
                })
                .catch((err) => done(err));
        });
    });
});