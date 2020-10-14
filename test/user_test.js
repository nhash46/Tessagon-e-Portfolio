'use strict';
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

        it('Should redirect to basic info form', (done) => {
            request(app).post('/user/signup')
                .send({
                    username: "tessagon",
                    email: "tessagon@tessagon.com",
                    password: "cold",
                    password2: "cold"
                })
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal('/signup/form/');
                    done();
                })
                .catch((err) => done(err));
        });
    });

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
    
    /**
    describe('populate profile', () => {

        var newUser;
        before(function (done) {

            var userInfo = {
                username: "tessagon",
                email: "tessagon@tessagon.com",
                password: "cold",
                password2: "cold"
            }

            newUser = User(userInfo);

            newUser.save((err) => {
                if (err) {
                    console.log(err);

                } else {
                    console.log('saved');
                }
            })

            done();
            
            request(app)
                .post('/user/signup')
                .send({
                    username: "tessagon",
                    email: "tessagon@tessagon.com",
                    password: "cold",
                    password2: "cold"
                })
                .end(function(err, res) {
                    if (err) throw err;
                    token = res.user._id;
                    done();
                  });

        });
        
        after(async () => {
            await User.deleteOne({username: "tessagon"});
        });


        it('Should redirect to profile page', (done) => {
            request(app)
                .post('/user/populateInfo')
                .send({
                    first_name: 'Naz',
                    last_name: 'Hashem',
                    bio: "Hey I'm Naz ...",
                    city: 'Melbourne',
                    state: 'VIC',
                    phone_number: '0412345678',
                })
                .query({_id: newUser._id})
                .then((res) => {
                    expect(res.statusCode).to.equal(302);
                    expect(res.headers.location).to.equal('/profile');
                    done();
                })
                .catch((err) => done(err));
        })
    })
    */
    

});