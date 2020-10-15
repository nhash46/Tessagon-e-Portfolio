'use strict';
const conn = require('../models/index')
const User = require('../models/user');
const Document = require('../models/document');
const userController = require('../controllers/userController');
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


describe('Upload Tests', () => {

    /*before(function (done) {
        this.timeout(10000);
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    });*/

    /*after(function (done) {
        this.timeout(10000);
        conn.close()
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


    describe('uploadDocument', () => {

        after(async () => {
            await Document.deleteOne({title: "uploadTestDoc"});
        })
        it('Should redirect to profile if file uploaded', function(done){
            this.timeout(10000);
            authenticatedSession.post('/user/upload')
                .field('title', 'uploadTestDoc')
                .field('subHead', 'subHead')
                .attach('file', __dirname + '/files/pdf.pdf')
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal('/user/profile');
                    done();
                })
                .catch((err) => done(err));
        });
        it('Should redirect to profile if no file uploaded', function(done){
            authenticatedSession.post('/user/upload')
                .send({})
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal('/user/profile');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('uploadPic', () => {

        it('Should redirect to profile if image uploaded', function(done){
            this.timeout(10000);
            authenticatedSession.post('/user/uploadPic')
                .attach('file', __dirname + '/files/tessagon-logo.png')
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal('/user/profile');
                    done();
                })
                .catch((err) => done(err));
        });
        it('Should redirect to profile if no image uploaded', function(done){
            authenticatedSession.post('/user/uploadPic')
                .send({})
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal('/user/profile');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('downloadDocument', () => {

        it('Should pipe document if document exists', function(done){
            this.timeout(5000);
            authenticatedSession.get('/user/document/70641e432f00e0b30a687e392d34b616.pdf')
                .then((res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                })
                .catch((err) => done(err));
        });
        it('Should throw error if document does not exist', function(done){
            authenticatedSession.get('/user/document/thisdocumentdoesnotexist.pdf')
                .then((res) => {
                    expect(res.statusCode).to.equal(404);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('downloadImage', () => {

        it('Should pipe image if image exists', function(done){
            this.timeout(5000);
            authenticatedSession.get('/user/image/31e8baf3f6f1a0c6eda58e29264b8032.png')
                .then((res) => {
                    expect(res.statusCode).to.equal(200);
                    done();
                })
                .catch((err) => done(err));
        });
        it('Should throw error if image does not exist', function(done){
            authenticatedSession.get('/user/image/thisimagedoesnotexist.png')
                .then((res) => {
                    expect(res.statusCode).to.equal(404);
                    done();
                })
                .catch((err) => done(err));
        });
    });
})