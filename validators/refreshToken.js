(() => {

    'use strict';
    const common = require('../lib/util')
    const commonResponseType = require('../static/static.json');


    const refreshTokenErrorHandle = (error, localization) => {
        const message = common.setLanguage(localization)

        switch (error.message) {
            case commonResponseType.VALIDATION.JWT_MALFORMED:
                error.message = message.REFRESH_TOKEN_IS_INVALID;
                break;
            case commonResponseType.VALIDATION.JWT_EXPIRED:
                error.message = message.REFRESH_TOKEN_IS_EXPIRED;
                break;
            default:
                error.message = message.REFRESH_TOKEN_ERROR
        }
        return error.message
    };


    /**
     * Export module functions to be accessed from outside
     */
    module.exports = {
        refreshTokenErrorHandle: refreshTokenErrorHandle,
    }
})