const Joi = require("joi");
const common = require("../lib/util");
const commonResponseType = require("../static/static.json");
const logger = require("../lib/logger");

/* User Login validation */
exports.login = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string()
        .email()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.EMAIL_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.EMAIL_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.EMAIL_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_EMAIL:
                err.message = message.EMAIL_FORMAT_IS_INCORRECT;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      password: Joi.string()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.PASSWORD_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.PASSWORD_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.PASSWORD_IS_REQUIRED;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.LOGIN_API_END +
          JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        err.details[0].message,
        err.details
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    } else {
      next();
    }
  });
};

/* User refreshToken validation */
exports.refreshToken = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object()
    .options({ abortEarly: false })
    .keys({
      refreshToken: Joi.string()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.REFRESH_TOKEN_CANNOT_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.REFRESH_TOKEN_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.REFRESH_TOKEN_IS_REQUIRED;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.REFRESH_TOKEN_API_END +
          JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        err.details[0].message,
        err.details
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    } else {
      next();
    }
  });
};

/* User signUp validation */
exports.signUp = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.NAME_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.NAME_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.NAME_IS_REQUIRED;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      email: Joi.string()
        .email()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.EMAIL_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.EMAIL_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.EMAIL_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_EMAIL:
                err.message = message.EMAIL_FORMAT_IS_INCORRECT;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.PASSWORD_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.PASSWORD_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.PASSWORD_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_MIN:
                err.message = message.PASSWORD_SHOULD_BE_MORE_THAN_6_CHARACTERS;
                break;
              case commonResponseType.VALIDATION.STRING_MAX:
                err.message =
                  message.PASSWORD_SHOULD_BE_LESS_THAN_30_CHARACTERS;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      roleID: Joi.array()
        .items(Joi.string().required())
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.ROLE_ID_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.ARRAY_INCLUDE_ONE:
                err.message = message.ROLE_ID_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.ROLE_ID_IS_REQUIRED;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
        commission: Joi.number()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      userType: Joi.string()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.USER_TYPE_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.USER_TYPE_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.USER_TYPE_IS_REQUIRED;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      mobileNumber: Joi.string().allow(),
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.SIGN_UP_API_END +
          JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        err.details[0].message,
        err.details
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    } else {
      next();
    }
  });
};

/* User forget password  validation */
exports.forgetPassword = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string()
        .email()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.EMAIL_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.EMAIL_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.EMAIL_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_EMAIL:
                err.message = message.EMAIL_FORMAT_IS_INCORRECT;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.FORGOT_PASSWORD_API_END +
          JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        err.details[0].message,
        err.details
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    } else {
      next();
    }
  });
};

/* User confirm forget password validation */
exports.confirmForgetPassword = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object()
    .options({ abortEarly: false })
    .keys({
      email: Joi.string()
        .email()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.EMAIL_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.EMAIL_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.EMAIL_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_EMAIL:
                err.message = message.EMAIL_FORMAT_IS_INCORRECT;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      confirmationCode: Joi.number()
        .integer()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.CONFIRMATION_CODE_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.NUMBER_BASE:
                err.message = message.CONFIRMATION_CODE_SHOULD_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.CONFIRMATION_CODE_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_MIN:
                err.message = message.CONFIRMATION_CODE_LENGTH_SHOULD_BE_5;
                break;
              case commonResponseType.VALIDATION.STRING_MAX:
                err.message = message.CONFIRMATION_CODE_LENGTH_SHOULD_BE_5;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.PASSWORD_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.PASSWORD_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.PASSWORD_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_MIN:
                err.message = message.PASSWORD_SHOULD_BE_MORE_THAN_6_CHARACTERS;
                break;
              case commonResponseType.VALIDATION.STRING_MAX:
                err.message =
                  message.PASSWORD_SHOULD_BE_LESS_THAN_30_CHARACTERS;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.CONFIRM_FORGOT_PASSWORD_API_END +
          req.user.userId +
          JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        err.details[0].message,
        err.details
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    } else {
      next();
    }
  });
};

/* User changePassword validation */
exports.changePassword = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object()
    .options({ abortEarly: false })
    .keys({
      oldPassword: Joi.string()
        .min(6)
        .max(30)
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.PASSWORD_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.PASSWORD_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.PASSWORD_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_MIN:
                err.message = message.PASSWORD_SHOULD_BE_MORE_THAN_6_CHARACTERS;
                break;
              case commonResponseType.VALIDATION.STRING_MAX:
                err.message =
                  message.PASSWORD_SHOULD_BE_LESS_THAN_30_CHARACTERS;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),

      newPassword: Joi.string()
        .min(6)
        .max(30)
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.NEW_PASSWORD_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.NEW_PASSWORD_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.NEW_PASSWORD_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_MIN:
                err.message =
                  message.NEW_PASSWORD_SHOULD_BE_MORE_THAN_6_CHARACTERS;
                break;
              case commonResponseType.VALIDATION.STRING_MAX:
                err.message =
                  message.NEW_PASSWORD_SHOULD_BE_LESS_THAN_30_CHARACTERS;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.CHANGE_PASSWORD_API_END +
          req.user.userId +
          JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        err.details[0].message,
        err.details
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    } else {
      next();
    }
  });
};

/* User update profile validation */
exports.updateProfileDetails = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string()
        .required()
        .max(30)
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.NAME_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.NAME_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.NAME_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_MAX:
                err.message = message.NAME_SHOULD_BE_LESS_THAN_30_LETTERS;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      email: Joi.string()
        .email()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.EMAIL_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.EMAIL_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.EMAIL_IS_REQUIRED;
                break;
              case commonResponseType.VALIDATION.STRING_EMAIL:
                err.message = message.EMAIL_FORMAT_IS_INCORRECT;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      mobileNumber: Joi.number()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.MOBILE_NUMBER_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.MOBILE_NUMBER_IS_REQUIRED;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
      roleId: Joi.string()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.ROLE_REQUIRED;
                break;
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
        commission: Joi.number()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              default:
                err.message = message.VALIDATION_ERROR;
            }
          });
          return errors;
        }),
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.UPDATE_PROFILE_API_END +
          req.user.userId +
          JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        err.details[0].message,
        err.details
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    } else {
      next();
    }
  });
};
// update end user
exports.updateEndUser = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object()
    .options({ abortEarly: false })
    .keys({
      name: Joi.string()
        .string()
        .required()
        .error((errors) => {
          errors.forEach((err) => {
            switch (err.type) {
              case commonResponseType.VALIDATION.ANY_EMPTY:
                err.message = message.NAME_CANNOT_BE_EMPTY;
                break;
              case commonResponseType.VALIDATION.STRING_BASE:
                err.message = message.NAME_CANNOT_BE_NUMBER;
                break;
              case commonResponseType.VALIDATION.ANY_REQUIRED:
                err.message = message.NAME_IS_REQUIRED;
                break;
            }
          });
          return errors;
        }),
    });

  Joi.validate(data, schema, (err, value) => {
    if (err) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.LOGIN_API_END +
          JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        err.details[0].message,
        err.details
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    } else {
      next();
    }
  });
};
