process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const sinon = require('sinon');
const mocha = require('mocha');
const assert = require('chai').assert;
const should = require('chai').should;
const chai = require('chai');

const app = require('../../../app.js');
const conn = require('../../../models/index.js');

describe('POST /user/signup', function() {
  this.timeout(100000);
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err));
  })

  after((done) => {
    conn.close()
      .then(() => done())
      .catch((err) => done(err));
  })

  it('OK, creating a new user works', (done) => {
    request(app).post('/user/signup')
      .send({ 
          username: 'tessagonUser', 
          email: "user@tessagon.com", 
          password: "Password123", 
          password2:"Password123" 
        })
      .then((res) => {
        expect(res.statusCode).to.equal(302);
        done();
      })
      .catch((err) => done(err));
  });

  /**
  it('Fail, note requires text', (done) => {
    request(app).post('/notes')
      .send({ name: 'NOTE' })
      .then((res) => {
        const body = res.body;
        expect(body.errors.text.name)
          .to.equal('ValidatorError')
        done();
      })
      .catch((err) => done(err));
  });
   */
})