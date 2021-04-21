const Joi = require('joi');
const common = require('../lib/util');
const commonResponseType = require('../static/static.json');
const logger = require('../lib/logger');


/* Permission create validation */
exports.create = (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE])
    const data = req.body;
    let schema = Joi.object().options({ abortEarly: false }).keys({
        name: Joi.string().required().error(errors => {
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
        value: Joi.string().required().error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.VALUE_CANNOT_BE_EMPTY;
                        break;
                    case commonResponseType.VALIDATION.STRING_BASE:
                        err.message = message.VALUE_CANNOT_BE_NUMBER;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.VALUE_IS_REQUIRED;
                        break;
                    default:
                        err.message = message.VALIDATION_ERROR
                }
            });
            return errors;
        }),
    });

    Joi.validate(data, schema, (err, value) => {

        if (err) {
            logger.log(commonResponseType.LOGGER.ERROR, commonResponseType.LOGGER.UPDATE_PROFILE_API_END + req.user.userId + JSON.stringify(err.details[0].message));
            const response = common.commonResponse(commonResponseType.RESPONSE_SUCCESS.FALSE, null, message.VALIDATION_FAIL_MESSAGE, err.details);
            res.status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR).json(response);
        } else {
            next();
        }

    });
}