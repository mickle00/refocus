/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * api/v1/controllers/apiaccess.js
 */

const configuredPassport = require('../../../index').passportModule;
const httpStatus = require('../constants').httpStatus;
const u = require('../helpers/verbs/utils');
const apiErrors = require('../apiErrors');
const jwtUtil = require('../../../utils/jwtUtil');
const helper = require('../helpers/nouns/tokens');
const logAPI = require('../../../utils/loggingUtil').logAPI;

const resourceName = 'token';

module.exports = {

  /**
   * Authenticates user and sends token in response with status code 200
   * if authenticated else responds with error.
   * @param {IncomingMessage} req - The request object
   * @param {ServerResponse} res - The response object
   * @param {Function} next - The next middleware function in the stack
   *
   */
  createTokenByCredentials(req, res, next) {
    configuredPassport.authenticate('local-login', (err, user/* , info */) => {
      if (err) {
        return u.handleError(next, err, resourceName);
      }

      if (!user) {
        const loginErr = new apiErrors.LoginError({
          explanation: 'Invalid credentials.',
        });
        loginErr.resource = resourceName;
        return u.handleError(next, loginErr, resourceName);
      }

      const createdToken = jwtUtil.createToken(user);
      helper.model.create({
        name: req.swagger.params.queryBody.value.tokenName,
        token: createdToken,
        userId: user.id,
      })
      .then((o) => {
        if (helper.loggingEnabled) {
          logAPI(req, helper.modelName, o);
        }

        return res.status(httpStatus.CREATED)
        .json(u.responsify(o, helper, req.method));
      })
      .catch((_err) => u.handleError(next, _err, helper.modelName));
    })(req, res, next);
  },

}; // exports
