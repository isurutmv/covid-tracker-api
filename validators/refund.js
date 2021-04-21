const Joi = require("joi");
const common = require("../lib/util");
const commonResponseType = require("../static/static.json");
// validate refund request body
exports.requestRefund = async (req, res, next) => {
  const schema = Joi.object({
    amount: Joi.number(),
    description: Joi.string().min(3).required(),
    transactionId: Joi.string().required(),
  });
  Joi.validate(req.body, schema, (err, value) => {
    if (err) {
      console.error(err);
      const response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        err.name,
        err.details[0].message
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_VALIDATION_ERROR)
        .json(response);
    }
    next();
  });
};
