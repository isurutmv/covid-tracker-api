(() => {
  "use strict";

  var config = require("config");
  var isEmpty = require("is-empty");
  var _ = require("lodash");
  var urlPattern = require("url-pattern");
  var common = require("../../../lib/util");
  var jwt = require("jsonwebtoken");
  var commonResponseType = require("../../../static/static.json");
  var validate = require("../servicers/auth.service");

  /**
   * Authenticate request
   * @param {object} req - Request data
   * @param {object} res - Response data
   * @param {object} next - Next data
   */
  const authRequest = async (req, res, next) => {
    let response;
    const message = common.setLanguage(req);

    if (
      req.headers["x-api-key"] === config.get("api.key") &&
      req.headers["x-api-secret"] === config.get("api.secret")
    ) {
      if (isGuestAction(req.path, req.method)) {
        // No need to check access token for guest actions
        next();
      } else {
        if (!isEmpty(req.headers["authorization"])) {
          let authHeader = req.headers["authorization"];
          authHeader = authHeader.replace("Bearer", "");
          authHeader = authHeader.trim();

          // check user logout or not
          if (!(await validate.checkJwt(authHeader))) {
            response = common.commonResponse(
              commonResponseType.RESPONSE_SUCCESS.FALSE,
              null,
              message.INVALID_AUTHORIZATION_TOKEN
            );
            res
              .status(commonResponseType.HTTP_RESPONSE.HTTP_FORBIDDEN)
              .json(response);
          }
          const tokenInfo = validate.validateJwt(authHeader);
          if (!isEmpty(tokenInfo)) {
            req.user = tokenInfo;

            jwt.verify(authHeader, config.get("Access_Token"), (err, user) => {
              if (err) {
                response = common.commonResponse(
                  commonResponseType.RESPONSE_SUCCESS.FALSE,
                  null,
                  message.INVALID_AUTHORIZATION_TOKEN
                );
                res
                  .status(commonResponseType.HTTP_RESPONSE.HTTP_FORBIDDEN)
                  .json(response);
              } else {
                next();
              }
            });
          } else {
            response = common.commonResponse(
              commonResponseType.RESPONSE_SUCCESS.FALSE,
              null,
              message.INVALID_AUTHORIZATION_TOKEN
            );
            res
              .status(commonResponseType.HTTP_RESPONSE.HTTP_FORBIDDEN)
              .json(response);
          }
        } else {
          response = common.commonResponse(
            commonResponseType.RESPONSE_SUCCESS.FALSE,
            null,
            message.AUTHORIZATION_TOKEN_IS_REQUIRED
          );
          res
            .status(commonResponseType.HTTP_RESPONSE.HTTP_FORBIDDEN)
            .json(response);
        }
      }
    } else {
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        message.API_ACCESS_KEYS_ARE_REQUIRED
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_FORBIDDEN)
        .json(response);
    }
  };

  /**
   * Check whether current request is a guest action request
   * @param {string} url - Request url
   * @param {string} method - Request method. Ex:POST, GET
   * @return {boolean}
   */
  const isGuestAction = (url, method) => {
    var isGuestAction = false;
    var guestActions = config.get("api.guestActions");
    for (var i = 0; i < guestActions.length; i++) {
      let pattern = new urlPattern(guestActions[i].url);
      let matchRes = pattern.match(url);

      if (method === guestActions[i].method && matchRes) {
        if (!isEmpty(matchRes.id) && !isEmpty(guestActions[i].ignore)) {
          if (_.indexOf(guestActions[i].ignore, matchRes.id) > -1) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
    }
    return isGuestAction;
  };

  /**
   * Export module functions to be accessed from outside
   */
  module.exports = {
    authRequest: authRequest,
  };
})();
