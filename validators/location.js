const Joi = require('joi');
const common = require('../lib/util');
const commonResponseType = require('../static/static.json')
const logger = require('../lib/logger');


/* location create validation */
exports.createLocation = (req, res, next) => {
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
        coordinates: Joi.array().min(2).max(2).required().items(Joi.number().required()).error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.COORDINATES_ARE_REQUIRED;
                        break;
                    case commonResponseType.VALIDATION.ARRAY_MIN:
                        err.message = message.LATITUDE_AND_LONGITUDE_SHOULD_BE_INCLUDE;
                        break;
                    case commonResponseType.VALIDATION.ARRAY_MAX:
                        err.message = message.LATITUDE_AND_LONGITUDE_SHOULD_BE_INCLUDE;
                        break;
                    case commonResponseType.VALIDATION.ARRAY_NOT_EMPTY:
                        err.message = message.COORDINATES_CANNOT_BE_EMPTY;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        address: Joi.string().required().error(errors => {
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
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        email: Joi.string().email().required().error(errors => {
            errors.forEach(err => {
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
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),

        contactNumber: Joi.string().allow(),
        web: Joi.string().allow(),
        tripadvisor: Joi.string().allow(),
        openHours: Joi.array().allow(),
        powerStations: Joi.array().allow(),
        coverImage: Joi.array().allow(),

        merchantId: Joi.string().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.USER_ID_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.USER_ID_CANNOT_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.USER_ID_IS_REQUIRED;
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

/* location update validation */
exports.updateLocation = (req, res, next) => {
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
        coordinates: Joi.array().min(2).max(2).required().items(Joi.number().required()).error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.COORDINATES_ARE_REQUIRED;
                        break;
                    case commonResponseType.VALIDATION.ARRAY_MIN:
                        err.message = message.LATITUDE_AND_LONGITUDE_SHOULD_BE_INCLUDE;
                        break;
                    case commonResponseType.VALIDATION.ARRAY_MAX:
                        err.message = message.LATITUDE_AND_LONGITUDE_SHOULD_BE_INCLUDE;
                        break;
                    case commonResponseType.VALIDATION.ARRAY_NOT_EMPTY:
                        err.message = message.COORDINATES_CANNOT_BE_EMPTY;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        address: Joi.string().required().error(errors => {
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
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
        email: Joi.string().email().required().error(errors => {
            errors.forEach(err => {
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
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),

        contactNumber: Joi.string().allow(),
        web: Joi.string().allow(),
        tripadvisor: Joi.string().allow(),
        openHours: Joi.array().allow(),
        powerStations: Joi.array().allow(),
        coverImage: Joi.array().allow(),

        merchantId: Joi.string().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.USER_ID_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.NUMBER_BASE:
                        err.message = message.USER_ID_CANNOT_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.USER_ID_IS_REQUIRED;
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
