/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * tests/db/model/bot/create.js
 */
'use strict';

const expect = require('chai').expect;
const tu = require('../../../testUtils');
const u = require('./utils');
const Bot = tu.db.Bot;
const constants = require('../../../../db/constants');

describe('db: bot: create: ', () => {
  after(u.forceDelete);

  describe('Create a new bot', () => {
    it('ok, bot created', (done) => {
      Bot.create(u.getStandard())
      .then((o) => {
        expect(o).to.have.property('name');
        expect(o).to.have.property('location').to.equal('http://www.bar.com');
        expect(o).to.have.property('active').to.equal(true);
        done();
      })
    .catch(done);
    });

    it('fail, bot empty name', (done) => {
      Bot.create({
        name: '',
        location: 'http://www.bar.com',
        active: true,
      })
      .then(() => done(tu.valError))
      .catch((err) => {
        expect(err.name).to.equal(tu.valErrorName);
        expect(err.message.toLowerCase()).to.contain('validation error');
        expect(err.message.toLowerCase()).to.contain('validation is failed');
        expect(err.errors[0].path).to.equal('name');
        done();
      })
    .catch(done);
    });

    it('fail, duplicate bot name', (done) => {
      Promise.all([Bot.create(u.getStandard()), Bot.create(u.getStandard())])
      .then(() => done(tu.uniError))
      .catch((err) => {
        debugger;
        expect(err.name).to.equal(tu.uniErrorName);
        expect(err.message.toLowerCase()).to.contain('validation error');
        expect(err.errors[0].message).to.contain('name must be unique');
        expect(err.errors[0].type).to.equal('unique violation');
        done();
      })
    .catch(done);
    });

    it('fail, bot wrong url', (done) => {
      Bot.create({
        name: u.name,
        location: 'notURL',
        active: true,
      })
      .then(() => done(tu.valError))
      .catch((err) => {
        expect(err.name).to.equal(tu.valErrorName);
        expect(err.message.toLowerCase()).to.contain('validation error');
          expect(err.message.toLowerCase()).to.contain('validation isurl ' +
            'failed');
        done();
      })
    .catch(done);
    });

    it('fail, bot wrong name', (done) => {
      Bot.create({
        name: `^1213@#@@#`,
        location: 'http://www.test.com',
        active: true,
      })
      .then(() => done(tu.valError))
      .catch((err) => {
        expect(err.name).to.equal(tu.valErrorName);
        expect(err.message.toLowerCase()).to.contain('validation error');
        done();
      })
    .catch(done);
    });

    it('fail, bot wrong action parameter name', (done) => {
      let bot = u.getStandard();
      bot.actions[0].parameters[0].name = '^1213@#@@#';
      Bot.create(bot)
      .then(() => done(tu.valError))
      .catch((err) => {
        expect(err.name).to.equal(tu.valErrorName);
        expect(err.message.toLowerCase()).to.contain('validation error');
        done();
      })
    .catch(done);
    });

    it('fail, bot wrong action parameter type', (done) => {
      let bot = u.getStandard();
      bot.actions[0].parameters[0].type = '^1213@#@@#';
      Bot.create(bot)
      .then(() => done(tu.valError))
      .catch((err) => {
        expect(err.name).to.equal(tu.valErrorName);
        expect(err.message.toLowerCase()).to.contain('validation error');
        done();
      })
    .catch(done);
    });

    it('fail, bot wrong data parameter name', (done) => {
      let bot = u.getStandard();
      bot.data[0].name = '^1213@#@@#';
      Bot.create(bot)
      .then(() => done(tu.valError))
      .catch((err) => {
        expect(err.name).to.equal(tu.valErrorName);
        expect(err.message.toLowerCase()).to.contain('validation error');
        done();
      })
    .catch(done);
    });

    it('fail, bot wrong data parameter type', (done) => {
      let bot = u.getStandard();
      bot.data[0].type = '^1213@#@@#';
      Bot.create(bot)
      .then(() => done(tu.valError))
      .catch((err) => {
        expect(err.name).to.equal(tu.valErrorName);
        expect(err.message.toLowerCase()).to.contain('validation error');
        done();
      })
    .catch(done);
    });
  });
});
