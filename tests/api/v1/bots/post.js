/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * tests/api/v1/bots/post.js
 */

'use strict';
const supertest = require('supertest');
const api = supertest(require('../../../../index').app);
const constants = require('../../../../api/v1/constants');
const u = require('./utils');
const path = '/v1/bots';
const expect = require('chai').expect;
const ZERO = 0;
const tu = require('../../../testUtils');

describe(`api: POST ${path}`, () => {
  let token;

  before((done) => {
    tu.createToken()
    .then((returnedToken) => {
      token = returnedToken;
      done();
    })
    .catch(done);
  });

  afterEach(u.forceDelete);
  afterEach(tu.forceDeleteUser);

  describe('POST bot', () => {
    it('Pass, post bot', (done) => {
      api.post(`${path}`)
      .set('Authorization', token)
      .send(u.getStandard())
      .expect(constants.httpStatus.CREATED)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        expect(res.body.name).to.equal(u.name);
        done();
      });
    });

    it('Fail, duplicate bot', (done) => {
      u.createStandard()
      .then(() => done());

      api.post(`${path}`)
      .set('Authorization', token)
      .send(u.getStandard())
      .expect(constants.httpStatus.FORBIDDEN)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.errors[ZERO].type).to
        .contain('SequelizeUniqueConstraintError');
      });
    });

    it('Fail, bot validation incorrect', (done) => {
      let testBot = u.getStandard();
      testBot.actions = 'INVALID_VALUE';

      api.post(`${path}`)
      .set('Authorization', token)
      .send(testBot)
      .expect(constants.httpStatus.BAD_REQUEST)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.errors[ZERO].type).to
        .contain('SCHEMA_VALIDATION_FAILED');
        done();
      });
    });
  });
});

