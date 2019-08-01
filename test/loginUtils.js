'use strict';

const request = require('supertest');

exports.getToken = function(app, user, cb) {
  request(app)
    .post('/api/Users/login')
    .send(user)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (err) {
        cb(err);
      } else {
        cb(res.body.id);
      }
    });
};
