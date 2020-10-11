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

describe('Blog Tests', () => {

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

    describe('show blogs', () => {

        it('Should display list of blogs belonging to a user', (done) => {
            request(app).get('/blog-posts/naz3')
                .then((res) => {
                    expect(res.statusCode).to.equal(200);
                    //expect(res.headers.location).to.equal('/blog-posts/naz3');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    /**
    describe('successful login', () => {

        it('Should redirect to profile page', (done) => {
            request(app).post('/user/login')
                .send({username: 'dccol', password: 'cold'})
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    done();
                })
                .catch((err) => done(err));
        })
    })

    describe('unsuccessful login', () => {

        it('Should redirect to login page', (done) => {
            request(app).post('/user/login')
                .send({username: 'unregistered_user', password: 'random'})
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal('/');
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
    */
    

});