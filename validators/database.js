(() => {

    'use strict';
    const common = require('../lib/util');
    const commonResponseType = require('../static/static.json');


    /**
     * This is mongoose validation part - due to multi language
     * Export module functions to be accessed from outside
     */
    exports.signUpDBErrorHandle = (error, localization) => {
        const message = common.setLanguage(localization)
        switch (error.code) {
            case commonResponseType.MONGOOSE_VALIDATION_CODE.DUPLICATE_DATA:
                error.message = message.DUPLICATE_RECORD;
                break;
            default:
                error.message = message.VALIDATION_ERROR
        }
        return error.message
    };


})();