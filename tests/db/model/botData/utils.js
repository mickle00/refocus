/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * tests/db/model/botAction/utils.js
 */
'use strict';

const tu = require('../../../testUtils');

const testStartTime = new Date();
const n = `${tu.namePrefix}TestBotData`;

const standard = {
  name: n,
  type: 'INTERGER',
};

module.exports = {
  name: n,

  getStandard() {
    return JSON.parse(JSON.stringify(standard));
  },

  createStandard() {
    return tu.db.BotData.create(standard);
  },

  forceDelete(done) {
    tu.forceDelete(tu.db.BotData, testStartTime)
    .then(() => done())
    .catch(done);
  },
};