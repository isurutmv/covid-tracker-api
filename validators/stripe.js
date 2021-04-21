const Joi = require("joi");
const common = require("../lib/util");
const commonResponseType = require("../static/static.json");
const logger = require("../lib/logger");

exports.addCard = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object().options({ abortEarly: false }).keys({
    number: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case commonResponseType.VALIDATION.ANY_EMPTY:
              err.message = message.NUMBER_CANNOT_BE_EMPTY;
              break;
            case commonResponseType.VALIDATION.NUMBER_BASE:
              err.message = message.NUMBER_CANNOT_BE_STRING;
              break;
            case commonResponseType.VALIDATION.ANY_REQUIRED:
              err.message = message.NUMBER_IS_REQUIRED;
              break;
            default:
              err.message = message.VALIDATION_ERROR;
          }
        });
        return errors;
      }),
    month: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case commonResponseType.VALIDATION.ANY_EMPTY:
              err.message = message.MONTH_CANNOT_BE_EMPTY;
              break;
            case commonResponseType.VALIDATION.NUMBER_BASE:
              err.message = message.MONTH_CANNOT_BE_STRING;
              break;
            case commonResponseType.VALIDATION.ANY_REQUIRED:
              err.message = message.MONTH_IS_REQUIRED;
              break;
            default:
              err.message = message.VALIDATION_ERROR;
          }
        });
        return errors;
      }),
    year: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case commonResponseType.VALIDATION.ANY_EMPTY:
              err.message = message.YEAR_CANNOT_BE_EMPTY;
              break;
            case commonResponseType.VALIDATION.NUMBER_BASE:
              err.message = message.YEAR_CANNOT_BE_STRING;
              break;
            case commonResponseType.VALIDATION.ANY_REQUIRED:
              err.message = message.YEAR_IS_REQUIRED;
              break;
            default:
              err.message = message.VALIDATION_ERROR;
          }
        });
        return errors;
      }),
    cvc: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case commonResponseType.VALIDATION.ANY_EMPTY:
              err.message = message.CVC_CANNOT_BE_EMPTY;
              break;
            case commonResponseType.VALIDATION.NUMBER_BASE:
              err.message = message.CVC_CANNOT_BE_STRING;
              break;
            case commonResponseType.VALIDATION.ANY_REQUIRED:
              err.message = message.CVC_IS_REQUIRED;
              break;
            default:
              err.message = message.VALIDATION_ERROR;
          }
        });
        return errors;
      }),
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
        message.VALIDATION_FAIL_MESSAGE,
        err, details
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    } else {
      next();
    }
  });
};
exports.changeDefault = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object().options({ abortEarly: false }).keys({
    paymentMethod: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case commonResponseType.VALIDATION.ANY_REQUIRED:
              err.message = message.PAYMENT_METHOD_IS_REQUIRED;
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
        commonResponseType.LOGGER.UPDATE_PROFILE_API_END +
        req.user.userId +
        JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        message.VALIDATION_FAIL_MESSAGE,
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

exports.charge = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object().options({ abortEarly: false }).keys({
    amount: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case commonResponseType.VALIDATION.ANY_REQUIRED:
              err.message = message.AMOUNT_IS_REQUIRED;
              break;
            case commonResponseType.VALIDATION.NUMBER_BASE:
              err.message = message.AMOUNT_CANNOT_BE_STRING;
              break;
            default:
              err.message = message.VALIDATION_ERROR;
          }
        });
        return errors;
      }),
    currency: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case commonResponseType.VALIDATION.ANY_EMPTY:
              err.message = message.CURRENCY_CANNOT_BE_EMPTY;
              break;
            case commonResponseType.VALIDATION.STRING_BASE:
              err.message = message.CURRENCY_CANNOT_BE_NUMBER;
              break;
            case commonResponseType.VALIDATION.ANY_REQUIRED:
              err.message = message.CURRENCY_IS_REQUIRED;
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
        commonResponseType.LOGGER.UPDATE_PROFILE_API_END +
        req.user.userId +
        JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        message.VALIDATION_FAIL_MESSAGE,
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

exports.deleteCard = (req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  const data = req.body;
  let schema = Joi.object().options({ abortEarly: false }).keys({
    card: Joi.string()
      .required()
      .error((errors) => {
        errors.forEach((err) => {
          switch (err.type) {
            case commonResponseType.VALIDATION.ANY_REQUIRED:
              err.message = message.CARD_IS_REQUIRED;
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
        commonResponseType.LOGGER.UPDATE_PROFILE_API_END +
        req.user.userId +
        JSON.stringify(err.details[0].message)
      );
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        message.VALIDATION_FAIL_MESSAGE,
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
