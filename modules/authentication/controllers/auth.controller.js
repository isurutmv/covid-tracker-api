(() => {
  ("use strict");

  const User = require("../repositories/auth.repository");
  const authService = require("../servicers/auth.service");
  const common = require("../../../lib/util");
  const commonResponseType = require("../../../static/static.json");
  const refreshToken = require("../../../validators/refreshToken");
  const database = require("../../../validators/database");
  const logger = require("../../../lib/logger");

  /* POST user authentication. */
  exports.authenticate = async (req, res, next) => {
    const requestBody = req.body;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    const message = common.setLanguage(localization);
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.LOGIN_API_START + JSON.stringify(requestBody)
    );
    let response;
    try {
      const user = await User.authUser(requestBody);
      const tokens = await authService.getJwt(user);
      user.accessToken = tokens[0];
      user.refreshToken = tokens[1];
      const data = common.userAuth(user);
      const userObject = await User.setDetails(data, localization);
      const userDetails = await authService.authResponse(userObject);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        userDetails,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.LOGIN_API_SUCCESS + JSON.stringify(response)
      );
    } catch (e) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.LOGIN_API_END + message.UNAUTHORIZED
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        e,
        null
      );
      res
        .status(commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json(response);
    }
  };

  /* POST user refreshToken. */
  exports.refreshToken = async (req, res, next) => {
    const requestBody = req.body;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.REFRESH_TOKEN_API_START +
      JSON.stringify(requestBody)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const accessToken = await authService.refreshJwt(
        requestBody.refreshToken
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        { accessToken },
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.REFRESH_TOKEN_API_SUCCESS +
        JSON.stringify(response)
      );
    } catch (e) {
      const errorMessage = refreshToken.refreshTokenErrorHandle(
        e,
        localization
      );
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.REFRESH_TOKEN_API_END + errorMessage
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        errorMessage,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  /* POST user signUp */
  exports.signUp = async (req, res, next) => {
    const requestBody = req.body;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.SIGN_UP_API_START + JSON.stringify(requestBody)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const tokens = await authService.getJwt(requestBody);
      const user = await User.createUser(requestBody, tokens, requestUserId);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        null,
        message.SUCCESS_MESSAGE,
        null
      );

      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.SIGN_UP_API_SUCCESS + JSON.stringify(response)
      );
    } catch (e) {
      const errorMessage = database.signUpDBErrorHandle(e, localization);
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.SIGN_UP_API_END + errorMessage
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        errorMessage,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  /* POST user forget password */
  exports.forgetPassword = async (req, res) => {
    const requestBody = req.body;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.FORGOT_PASSWORD_API_START +
      JSON.stringify(requestBody)
    );
    const message = common.setLanguage(localization);
    let response;

    try {
      const user = await User.forgetPassword(requestBody, localization);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        {},
        user,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.FORGOT_PASSWORD_API_SUCCESS +
        JSON.stringify(response)
      );
    } catch (e) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.FORGOT_PASSWORD_API_END + JSON.stringify(e)
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        e.message || message.UNDEFINED,
        null
      );
      res
        .status(e.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json(response);
    }
  };

  /* POST user confirm forget password */
  exports.confirmForgetPassword = async (req, res) => {
    const requestBody = req.body;
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.CONFIRM_FORGOT_PASSWORD_API_START +
      JSON.stringify(requestBody)
    );
    let response;

    try {
      const user = await User.confirmForgetPassword(
        requestBody,
        req.headers[commonResponseType.ACCEPT_LANGUAGE]
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        {},
        user,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.CONFIRM_FORGOT_PASSWORD_API_SUCCESS +
        JSON.stringify(response)
      );
    } catch (error) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.CONFIRM_FORGOT_PASSWORD_API_END +
        JSON.stringify(error)
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        e.message || message.UNDEFINED,
        null
      );
      res
        .status(e.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json(response);
    }
  };

  /* POST user changePassword */
  exports.changePassword = async (req, res, next) => {
    const requestBody = req.body;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.CHANGE_PASSWORD_API_START +
      requestUserId +
      JSON.stringify(requestBody)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      await User.validatePassword(requestBody, localization);
      await User.changePassword(requestBody, localization);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        {},
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.CHANGE_PASSWORD_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
    } catch (e) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.CHANGE_PASSWORD_API_END + requestUserId + e
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        e.message || message.UNDEFINED,
        null
      );
      res
        .status(e.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST)
        .json(response);
    }
  };

  /* GET user profile details */
  exports.getProfileDetails = async (req, res, next) => {
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.GET_PROFILE_API_START + requestUserId
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.getCurrentUserDetails(
        requestUserId,
        localization
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.CHANGE_PASSWORD_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
    } catch (error) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.CHANGE_PASSWORD_API_END +
        requestUserId +
        error
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* PUT update user profile details */
  exports.updateProfileDetails = async (req, res, next) => {
    const requestBody = req.body;
    const requestParams = req.params.id;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.UPDATE_PROFILE_API_START +
      requestUserId +
      JSON.stringify(requestBody)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await User.updateUser(requestParams, requestBody);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.UPDATE_PROFILE_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
    } catch (error) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.UPDATE_PROFILE_API_END + requestUserId + error
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* GET user details */
  exports.getUserList = async (req, res, next) => {
    const requestPramsId = req.params.id;
    const requestUserId = req.user.userId;
    const requestQuery = req.query.page;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.USER_LIST_API_START +
      requestUserId +
      JSON.stringify(requestPramsId)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.getUsers(
        requestPramsId,
        localization,
        requestQuery
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.USER_LIST_API_SUCEESS +
        requestUserId +
        JSON.stringify(response)
      );
    } catch (error) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.USER_LIST_API_END + requestUserId + error
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* DELETE user */
  exports.deleteUser = async (req, res, next) => {
    const requestPramsId = req.params.id;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.USER_DELETE_API_START +
      requestUserId +
      JSON.stringify(requestPramsId)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.deleteUser(
        requestPramsId,
        localization
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        null,
        message.USER_DELETED_SUCCESSFULLY,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.USER_DELETE_API_SUCEESS +
        requestUserId +
        JSON.stringify(response)
      );
    } catch (error) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.USER_DELETE_API_END + requestUserId + error
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* GET all admins */
  exports.getAdminsDetails = async (req, res, next) => {
    const requestQuery = req.query.page;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.GET_ALL_ADMINS_API_START +
      requestUserId +
      JSON.stringify(requestQuery)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.adminList(requestQuery, localization);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.GET_ALL_ADMINS_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
    } catch (error) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.GET_ALL_ADMINS_API_END + requestUserId + error
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  // update card add status
  exports.updateCardStatus = async (req, res, next) => {
    const requestUserId = req.user.userId;
    const requestBody = req.body;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      requestUserId + JSON.stringify(requestBody)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.updateStatus(
        requestUserId,
        requestBody
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        requestUserId + JSON.stringify(response)
      );
    } catch (error) {
      logger.log(commonResponseType.LOGGER.ERROR, requestUserId + error);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* GET all merchants */
  exports.getMerchantsDetails = async (req, res, next) => {
    const requestQuery = req.query.page;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.GET_ALL_MERCHANTS_API_START +
      requestUserId +
      JSON.stringify(requestQuery)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.merchantList(
        requestQuery,
        localization
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.GET_ALL_MERCHANTS_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
    } catch (error) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.GET_ALL_MERCHANTS_API_END +
        requestUserId +
        error
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* GET all technicians */
  exports.getTechniciansDetails = async (req, res, next) => {
    const requestQuery = req.query.page;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.GET_ALL_TECHNICIANS_API_START +
      requestUserId +
      JSON.stringify(requestQuery)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.techniciansList(
        requestQuery,
        localization
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.GET_ALL_TECHNICIANS_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
    } catch (error) {
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.GET_ALL_TECHNICIANS_API_END +
        requestUserId +
        error
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  exports.getEndUserDetails = async (req, res, next) => {
    const requestQuery = req.query.page;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      requestUserId + JSON.stringify(requestQuery)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.endUserList(requestQuery, localization);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        requestUserId + JSON.stringify(response)
      );
    } catch (error) {
      logger.log(commonResponseType.LOGGER.ERROR, requestUserId + error);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* search all admins */
  exports.searchAdminsDetails = async (req, res, next) => {
    const requestQuery = req.query.page;
    const search = req.query.search;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      requestUserId + JSON.stringify(requestQuery)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.searchAdmin(
        requestQuery,
        localization,
        search
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        requestUserId + JSON.stringify(response)
      );
    } catch (error) {
      logger.log(commonResponseType.LOGGER.ERROR, requestUserId + error);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* search all merhants */
  exports.searchMerhantDetails = async (req, res, next) => {
    const requestQuery = req.query.page;
    const search = req.query.search;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      requestUserId + JSON.stringify(requestQuery)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.searchMerchant(
        requestQuery,
        localization,
        search
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        requestUserId + JSON.stringify(response)
      );
    } catch (error) {
      logger.log(commonResponseType.LOGGER.ERROR, requestUserId + error);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* search all technician */
  exports.searchATechnisianDetails = async (req, res, next) => {
    const requestQuery = req.query.page;
    const search = req.query.search;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      requestUserId + JSON.stringify(requestQuery)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.searchTechnicians(
        requestQuery,
        localization,
        search
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        requestUserId + JSON.stringify(response)
      );
    } catch (error) {
      logger.log(commonResponseType.LOGGER.ERROR, requestUserId + error);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* search all end users */
  exports.searchEndUsersDetails = async (req, res, next) => {
    const requestQuery = req.query.page;
    const search = req.query.search;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      requestUserId + JSON.stringify(requestQuery)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.searchEndUser(
        requestQuery,
        localization,
        search
      );
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        requestUserId + JSON.stringify(response)
      );
    } catch (error) {
      logger.log(commonResponseType.LOGGER.ERROR, requestUserId + error);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  /* upload user images */
  exports.uploadImage = async (req, res, next) => {
    const requestbody = req.body;
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(
      commonResponseType.LOGGER.INFO,
      requestUserId + JSON.stringify(requestbody)
    );
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.uploadImage(req, requestUserId);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.SUCCESS_MESSAGE,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        requestUserId + JSON.stringify(response)
      );
    } catch (error) {
      logger.log(commonResponseType.LOGGER.ERROR, requestUserId + error);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error.message || message.UNDEFINED,
        null
      );
      res
        .status(
          error.status || commonResponseType.HTTP_RESPONSE.HTTP_BAD_REQUEST
        )
        .json(response);
    }
  };

  // logout user
  exports.logout = async (req, res, next) => {
    const requestUserId = req.user.userId;
    const localization = req.headers[commonResponseType.ACCEPT_LANGUAGE];
    logger.log(commonResponseType.LOGGER.INFO, requestUserId);
    const message = common.setLanguage(localization);
    let response;
    try {
      const details = await authService.logout(requestUserId);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        details,
        message.LOGOUT_SUCCESS,
        null
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
      logger.log(
        commonResponseType.LOGGER.INFO,
        requestUserId + JSON.stringify(response)
      );
    } catch (error) {
      logger.log(commonResponseType.LOGGER.ERROR, requestUserId + error);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        error,
        null
      );
      res.status(error.status || 400).json(response);
    }
  };
})();
