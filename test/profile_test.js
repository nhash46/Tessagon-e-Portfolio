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

    describe("getUserProfile (restricted)", () => {

        it('Should get a restricted page', function (done) {
            this.timeout(4000);
            authenticatedSession.get('/user/profile')
              .expect(200)
              .end(done)
          });
    });

    describe("getOtherUserProfile", () => {

        it("Should get another user's profile", function (done) {
            this.timeout(4000);
            authenticatedSession.get('/user/profile/naz3')
              .expect(200)
              .end(done)
        });

        it("Should go to error page if profile does not exist", function (done) {
            this.timeout(4000);
            authenticatedSession.get('/user/profile/imafakeuser')
                .then((res) => {
                    expect(res.statusCode).to.equal(404)
                    done()
                })
                .catch((err) => done(err));
        });
    });

    describe('editNavInfo', () => {

        it("Should update contact information and redirect to profile", (done) => {
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

    describe('editHomeInfo', () => {

        it("Should update home section and redirect to profile", (done) => {
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

    describe('editAboutMe', () => {

        it("Should update about me section and redirect to profile", (done) => {
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

    describe('populateInfo', () => {

        it("Should populate profile with sign up form info and redirect to profile", (done) => {
            authenticatedSession.post('/populateInfo')
                .send({ 
                    first_name: 'Tess', 
                    last_name: 'Agon',
                    phone_number: '0412 345 678', 
                    city: 'Melbourne',
                    state: 'Victoria', 
                    bio: 'This is a new bio', 
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('addExperience', () => {

        it("Should create new experience artifact, link to user and redirect to profile", (done) => {
            authenticatedSession.post('/addExperience')
                .send({ 
                    company: 'Tessagon',
                    role: 'Intern',
                    experienceStartDate: Date.now(),
                    experienceEndDate: Date.now(),
                    descriptionExp: "My first internship"
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('editExperience', () => {

        it("Should update existing experience artifact and redirect to profile", (done) => {
            authenticatedSession.post('/editExperience/5f6c51d6774064194cd9bc46')
                .send({ 
                    company: 'Tessagon',
                    role: 'CEO',
                    experienceStartDate: Date.now(),
                    experienceEndDate: Date.now(),
                    descriptionExp: "I'm the CEO now"
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    /**
    describe('deleteExperience', () => {

        before(function (done) {
            authenticatedSession.post('/addExperience')
                .send({ 
                    company: 'Tessagon',
                    role: 'Intern',
                    experienceStartDate: Date.now(),
                    experienceEndDate: Date.now(),
                    descriptionExp: "My first internship"
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });

        it("Should update existing experience artefeact and redirect to profile", (done) => {
            authenticatedSession.post('/editExperience/5f6c51d6774064194cd9bc46')
                .send({ 
                    company: 'Tessagon',
                    role: 'CEO',
                    experienceStartDate: Date.now(),
                    experienceEndDate: Date.now(),
                    descriptionExp: "I'm the CEO now"
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });
     */

    describe('addEducation', () => {

        it("Should create new education artefeact, link to user and redirect to profile", (done) => {
            authenticatedSession.post('/addEducation')
                .send({ 
                    university: 'Melbourne University',
                    degree: 'Computing and Software Systems',
                    educationStartDate: Date.now(),
                    educationEndDate: Date.now(),
                    descriptionEdu: 'My first degree'
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('editEducation', () => {

        it("Should update existing education artefeact and redirect to profile", (done) => {
            authenticatedSession.post('/editEducation/5f6c51d7774064194cd9bc47')
                .send({ 
                    university: 'Melbourne University',
                    degree: 'Software Engineering',
                    educationStartDate: Date.now(),
                    educationEndDate: Date.now(),
                    descriptionEdu: 'My updated degree'
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('changePassword', () => {

        it("Should update existing password and redirect to profile", (done) => {
            authenticatedSession.post('/user/change-password')
                .send({ 
                    old_password: 'cold',
                    new_password: 'cold',
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });

        /**
        it("Should fail to update existing password and reload change password page", (done) => {
            authenticatedSession.post('/user/change-password')
                .send({ 
                    old_password: 'cold567',
                    new_password: 'cold',
                })
                .then((res) => {
                    expect(302);
                    expect(res.headers.location).to.equal('/user/change-password');
                    done();
                })
                .catch((err) => done(err));
        });
         */
    });
    
    /**
    describe('addTypewriterWords', () => {

        it("Should store typewriter words, link to user and redirect to profile", (done) => {
            authenticatedSession.post('/populateProfile')
                .send({ 
                    type
                })
                .then((res) => {
                    expect(302);
                    done();
                })
                .catch((err) => done(err));
        });
    });
     */
});