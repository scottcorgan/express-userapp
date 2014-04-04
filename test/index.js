var authenticate = require('../');
var expect = require('expect.js');
var request = require('supertest');
var express = require('express');
var UserApp = require('userapp');

describe('authentication middleware', function () {
  var app;
  
  beforeEach(function () {
    app = express();
    app.use(function (req, res, next) {
      req.cookies = {
        ua_session_token: 'asdf'
      };
      
      next();
    });
  });
  
  it('initializes UserApp if it is not already', function () {
    app.use(authenticate(123));
    expect(UserApp.global.appId).to.equal(123);
    
    app.use(authenticate(456));
    expect(UserApp.global.appId).to.equal(123);
  });
  
  it('passes through on authenticated request', function (done) {
    app.use(authenticate());
    app.use(function (req, res, next) {
      expect(req.userapp.user).to.equal('user');
      next();
    });
    
    app.get('/test', success);
    setGetUser();
    
    request(app)
      .get('/test')
      .expect(200)
      .end(done);
  });
  
  it('returns a bad request if cookies are missiong', function (done) {
    app.use(function (req, res, next) {
      req.cookies.ua_session_token = null;
      next();
    });
    
    app.use(authenticate());
    app.get('/test', success);
    setGetUser();
    
    request(app)
      .get('/test')
      .expect(400)
      .end(done);
  });
  
  it('shows unauthorzied with invalid credentials', function (done) {
    app.use(authenticate());
    app.get('/test', success);
    setGetUser({name: 'INVALID_CREDENTIALS', message: 'invalid'});
    
    request(app)
      .get('/test')
      .expect(401)
      .expect('invalid')
      .end(done);
  });
  
  it('sends back bad request on any other error', function (done) {
    app.use(authenticate());
    app.get('/test', success);
    setGetUser({});
    
    request(app)
      .get('/test')
      .expect(400)
      .end(done);
  });
  
});

function setGetUser (err) {
  UserApp.User.get = function (query, callback) {
    expect(query.user_id).to.equal('self');
    callback(err, ['user']);
  };
}

function success (req, res) {
  res.send(200, 'test');
}