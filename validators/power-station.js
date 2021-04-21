const Joi = require('joi');
const common = require('../lib/util');
const commonResponseType = require('../static/static.json')
const logger = require('../lib/logger');


/* power-station create validation */
exports.createPowerStation = (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE])
    const data = req.body;
    let schema = Joi.object().options({ abortEarly: false }).keys({
        name: Joi.string().min(3).max(40).required().error(errors => {
            errors.forEach(err => {
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
                    case commonResponseType.VALIDATION.STRING_MIN:
                        err.message = message.NAME_SHOULD_BE_MORE_THAN_3_LETTERS;
                        break;
                    case commonResponseType.VALIDATION.STRING_MAX:
                        err.message = message.NAME_SHOULD_BE_LESS_THAN_40_LETTERS;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        serialNo: Joi.string().min(3).max(40).required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.SERIAL_NO_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.STRING_BASE:
                        err.message = message.SERIAL_NO_CANNOT_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.SERIAL_NO_IS_REQUIRED;
                        break;
                    case commonResponseType.VALIDATION.STRING_MIN:
                        err.message = message.SERIAL_NO_SHOULD_BE_MORE_THAN_3_CHARACTERS;
                        break;
                    case commonResponseType.VALIDATION.STRING_MAX:
                        err.message = message.SERIAL_NO_SHOULD_BE_LESS_THAN_40_CHARACTERS;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        address: Joi.string().min(3).max(100).required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.ADDRESS_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.STRING_BASE:
                        err.message = message.ADDRESS_CANNOT_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.ADDRESS_ID_IS_REQUIRED;
                        break;
                    case commonResponseType.VALIDATION.STRING_MIN:
                        err.message = message.ADDRESS_SHOULD_BE_MORE_THAN_3_CHARACTERS;
                        break;
                    case commonResponseType.VALIDATION.STRING_MAX:
                        err.message = message.ADDRESS_SHOULD_BE_LESS_THAN_40_CHARACTERS;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        total: Joi.number().integer().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.TOTAL_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.TOTAL_SHOULD_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.TOTAL_IS_REQUIRED;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        available: Joi.number().integer().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.AVAILABLE_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.AVAILABLE_SHOULD_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.AVAILABLE_IS_REQUIRED;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
    })

    Joi.validate(data, schema, (err, value) => {
        if (err) {
            logger.log(commonResponseType.LOGGER.ERROR, commonResponseType.LOGGER.CREATE_POWER_STATION_API_END + JSON.stringify(err.details[0].message));
            const response = common.commonResponse(commonResponseType.RESPONSE_SUCCESS.FALSE, null, err.details[0].message, err.details);
            res.status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR).json(response);
        } else {
            next();
        }

    });
}

/* power-station update validation */
exports.updatePowerStation = (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE])
    const data = req.body;
    let schema = Joi.object().options({ abortEarly: false }).keys({
        name: Joi.string().min(3).max(40).required().error(errors => {
            errors.forEach(err => {
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
                    case commonResponseType.VALIDATION.STRING_MIN:
                        err.message = message.NAME_SHOULD_BE_MORE_THAN_3_LETTERS;
                        break;
                    case commonResponseType.VALIDATION.STRING_MAX:
                        err.message = message.NAME_SHOULD_BE_LESS_THAN_40_LETTERS;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        serialNo: Joi.string().min(3).max(40).required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.SERIAL_NO_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.STRING_BASE:
                        err.message = message.SERIAL_NO_CANNOT_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.SERIAL_NO_IS_REQUIRED;
                        break;
                    case commonResponseType.VALIDATION.STRING_MIN:
                        err.message = message.SERIAL_NO_SHOULD_BE_MORE_THAN_3_CHARACTERS;
                        break;
                    case commonResponseType.VALIDATION.STRING_MAX:
                        err.message = message.SERIAL_NO_SHOULD_BE_LESS_THAN_40_CHARACTERS;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        address: Joi.string().min(3).max(100).required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.ADDRESS_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.STRING_BASE:
                        err.message = message.ADDRESS_CANNOT_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.ADDRESS_ID_IS_REQUIRED;
                        break;
                    case commonResponseType.VALIDATION.STRING_MIN:
                        err.message = message.ADDRESS_SHOULD_BE_MORE_THAN_3_CHARACTERS;
                        break;
                    case commonResponseType.VALIDATION.STRING_MAX:
                        err.message = message.ADDRESS_SHOULD_BE_LESS_THAN_40_CHARACTERS;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        total: Joi.number().integer().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.TOTAL_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.TOTAL_SHOULD_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.TOTAL_IS_REQUIRED;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        available: Joi.number().integer().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.AVAILABLE_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.AVAILABLE_SHOULD_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.AVAILABLE_IS_REQUIRED;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
    })

    Joi.validate(data, schema, (err, value) => {
        if (err) {
            logger.log(commonResponseType.LOGGER.ERROR, commonResponseType.LOGGER.GET_ALL_POWER_STATION_API_END + JSON.stringify(err.details[0].message));
            const response = common.commonResponse(commonResponseType.RESPONSE_SUCCESS.FALSE, null, err.details[0].message, err.details);
            res.status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR).json(response);
        } else {
            next();
        }

    });
}

/* power-station search validation */
exports.searchPowerStation = (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE])
    const data = req.query;

    let schema = Joi.object().options({ abortEarly: false }).keys({
        lat: Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.LATITUDE_SHOULD_BE_A_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.LATITUDE_IS_REQUIRED;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        long: Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.LONGITUDE_SHOULD_BE_A_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.LONGITUDE_IS_REQUIRED;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        distance: Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.DISTANCE_SHOULD_BE_A_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.DISTANCE_IS_REQUIRED;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        skip: Joi.number().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.PAGINATION_SHOULD_BE_A_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.PAGINATION_NUMBER_IS_REQUIRED;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
    })

    Joi.validate(data, schema, (err, value) => {
        if (err) {
            logger.log(commonResponseType.LOGGER.ERROR, commonResponseType.LOGGER.SEARCH_POWER_STATION_API_END + JSON.stringify(err.details[0].message));
            const response = common.commonResponse(commonResponseType.RESPONSE_SUCCESS.FALSE, null, err.details[0].message, err.details);
            res.status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR).json(response);
        } else {
            next();
        }

    });
}