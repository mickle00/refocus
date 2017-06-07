/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * db/model/roomType.js
 *
 * Room Types are specialized configurations for rooms. They hold intial
 * data such as settings and rules to quickly make a room usable.
 *
 * Settings are key/value pairings that work similar to enviromental variables
 * they store data that configure bots so the rooms they are in.
 *
 * Rules contain rule that is a JSON Logic Object(http://jsonlogic.com/) and
 * and an action object that has the name of the action and parameters values
 * of the action needed to be taken when rule is valid.
 *
 */

const constants = require('../constants');
const u = require('../helpers/roomTypeUtils');
const assoc = {};

module.exports = function user(seq, dataTypes) {
  const RoomType = seq.define('RoomType', {
    id: {
      type: dataTypes.UUID,
      primaryKey: true,
      defaultValue: dataTypes.UUIDV4,
    },
    name: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: constants.nameRegex,
      },
      comment: 'Create a named room type',
    },
    active: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Determines if room type is still active',
    },
    settings: {
      type: dataTypes.ARRAY(dataTypes.JSON),
      allowNull: true,
      validate: {
        contains: u.validateSettings,
      },
      comment: 'Key/Value pairs for user specific settings',
    },
    rules: {
      type: dataTypes.ARRAY(dataTypes.JSON),
      allowNull: true,
      validate: {
        contains: u.validateRules,
      },
      comment: 'Logic and resulting actions for rooms',
    },
  }, {
    classMethods: {
      getRoomTypeAssociations() {
        return assoc;
      },

      postImport(models) {
        assoc.writers = RoomType.belongsToMany(models.User, {
          as: 'writers',
          through: 'RoomTypeWriters',
          foreignKey: 'roomTypeId',
        });
      },
    },
  });
  return RoomType;
};

