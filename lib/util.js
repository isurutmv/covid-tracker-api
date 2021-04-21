(() => {

    'use strict';
    var languageSet = require('../languages/translation.json');

    /**
     * Prepare static response JSON
     * @param {boolean} success - True or False
     * @param {object} data - Any other date to be sent. Ex:view record data
     * @param {string} message - Optional message to be sent
     * @param {object} error - Error object
     * @returns {object}
     */
    const commonResponse = (success, data = '', message = '', error = '') => ({
        'success': success,
        'data': data,
        'message': message,
        'error': error
    });

    /**
     * Remove attributes those not be sent with response. ex:_id, __v
     * @param {object} object - JSON object
     * @param {array} attributes - Attributes to be removed
     * @returns {object}
     */
    const removeAttributes = (object, attributes) => {

        var objectRes = {};
        for (var key in object.toJSON()) {
            if (attributes.indexOf(key) == -1) {
                objectRes[key] = object[key];
            }
        }

        return objectRes;
    };

    /**
     * Prepare response JSON object for user when authentication. Just include permissions
     * @param {object} user - JSON object
     * @returns {object}
     */
    const userAuth = user => {
        const msg = removeAttributes(user, ['_id', 'password', '__v', 'resetPasswordToken', 'resetPasswordExpires', 'lastPasswordChangeDate']);
        msg.id = user._id;
        return msg;
    };

    /**
     * Prepare response JSON object for user when authentication. Just include permissions
     * @param {object} user - JSON object
     * @returns {object}
     */
    const userCommon = user => {
        const msg = removeAttributes(user, ['_id', 'password', '__v', 'resetPasswordToken', 'resetPasswordExpires', 'lastPasswordChangeDate', 'accessToken', 'refreshToken', 'roleID']);
        msg.id = user._id;
        return msg;
    };

    /**
     * set response message language type
     * @param {string} lang - Language type
     * @returns {object}
     */
    const setLanguage = (lang) => {
        if (lang === '' || lang === undefined || lang === 'en-US') {
            return languageSet["en-US"]
        }
        const langType = lang
        return languageSet[langType] === undefined ? languageSet["en-US"] : languageSet[langType];
    };


    /**
     * Export module functions to be accessed from outside
     */
    module.exports = {
        commonResponse: commonResponse,
        userAuth: userAuth,
        userCommon: userCommon,
        setLanguage: setLanguage,
    }
})();