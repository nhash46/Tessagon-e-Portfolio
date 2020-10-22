'use strict';
const conn = require('../models/index');
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

describe('Comment Tests', () => {

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
                authenticatedSession = testSession;
                return done();
            });
    });

    describe('Make new comment', () => {
        it ('Should create a new comment', (done) => {
            authenticatedSession.post('/blog-posts/dccol/5f87dbeb94320920e7af6908')
                .send ({
                    author : 'dccol',
                    content : 'this is a new comment',
                    parentPost : '5f87dbeb94320920e7af6908',
                    date: Date.now()
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('Like comment', () => {
        it ('Should like a comment', (done) => {
            authenticatedSession.post('/blog-posts/likeComment/5f87dbfc94320920e7af6909')
                .send ({
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('Unlike comment', () => {
        it ('Should unlike a comment', (done) => {
            authenticatedSession.post('/blog-posts/unlikeComment/5f87dbfc94320920e7af6909')
                .send ({
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('edit comment', () => {
        it ('Should edit a comment', (done) => {
            authenticatedSession.post('/blog-posts/edit/5f87d203d97f8f1e03d1a058')
                .send ({
                    content: 'COMMENT FOR TESTS DO NOT DELETE',
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});

    /*
       describe('post blog', () => {
        it ('Should create a new blog post', (done) => {
            authenticatedSession.post('/blog-posts/dccol/submit')
                .send ({
                    title: 'Test blog',
                    author: 'dccol',
                    authorFullName: 'Dan Cole',
                    body: 'this is a test blog',
                    date: Date.now()
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });
     */