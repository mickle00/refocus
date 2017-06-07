/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * tests/db/model/roomType/create.js
 */
'use strict';

const expect = require('chai').expect;
const tu = require('../../../testUtils');
const u = require('./utils');
const RoomType = tu.db.RoomType;

describe('db: roomType: create: ', () => {
  after(u.forceDelete);

  describe('Create a new room type', () => {
    it('ok, room created', (done) => {
      RoomType.create(u.getStandard())
      .then((o) => {
        expect(o).to.have.property('name');
        done();
      })
    .catch(done);
    });
  });
});
