const Joi = require("joi");
const common = require("../lib/util");
const commonResponseType = require('../static/static.json');

/* Permission create validation */
exports.create = (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
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
        permissions: Joi.array().items(Joi.string().required()).error(errors => {
            errors.forEach(err => {
                switch (err.type) {
                    case commonResponseType.VALIDATION.ANY_EMPTY:
                        err.message = message.PERMISSION_IS_REQUIRED;
                        break;
                    case commonResponseType.VALIDATION.ARRAY_INCLUDE_ONE:
                        err.message = message.PERMISSION_IS_REQUIRED;
                        break;
                    case commonResponseType.VALIDATION.ANY_REQUIRED:
                        err.message = message.PERMISSION_CANNOT_BE_EMPTY;
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
            logger.log(commonResponseType.LOGGER.ERROR, commonResponseType.LOGGER.ROLE_API_END + JSON.stringify(err.details[0].message));
            const response = common.commonResponse(commonResponseType.RESPONSE_SUCCESS.FALSE, null, err.details[0].message, err.details);
            res.status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR).json(response);
        } else {
            next();
        }

    });
};
