(() => {
  "use strict";

  const common = require("../../../lib/util");
  const permissionRepository = require("../repositories/permission.repository");
  const commonResponseType = require("../../../static/static.json");
  const logger = require("../../../lib/logger");

  exports.createPermissions = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestUserId = req.user.userId
    const requestBody = req.body
    let response;
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.PERMISSION_API_START +
      requestUserId +
      JSON.stringify(requestBody)
    );
    try {
      const permission = await permissionRepository.create(requestBody);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        permission,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.PERMISSION_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
    } catch (e) {
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        message.UNAUTHORIZED,
        null
      );
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.PERMISSION_API_END +
        requestUserId +
        e.message
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  exports.getAllPermissions = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestUserId = req.user.userId
    let response;
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.PERMISSION_API_START +
      requestUserId +
      JSON.stringify(req.body)
    );
    try {
      const permissions = await permissionRepository.getAll();
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        permissions,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.PERMISSION_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
    } catch (e) {
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        message.UNAUTHORIZED,
        null
      );
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.PERMISSION_API_END +
        requestUserId +
        e.message
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  exports.getonePermission = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestUserId = req.user.userId
    const requestParamsId = req.params.id
    let response;
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.PERMISSION_API_START +
      requestUserId +
      JSON.stringify(req.body)
    );
    try {
      const permission = await permissionRepository.getOne(requestParamsId);
      if (!permission) {
        return res.status(commonResponseType.HTTP_RESPONSE.HTTP_NOT_FOUND);
      }
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        permission,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.PERMISSION_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
    } catch (e) {
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        e.message,
        null
      );
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.PERMISSION_API_END +
        requestUserId +
        e.message
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  exports.updatePermission = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestUserId = req.user.userId
    const requestParamsId = req.params.id
    const requestBody = req.body
    let response;
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.PERMISSION_API_START +
      requestUserId +
      JSON.stringify(req.body)
    );
    try {
      const permission = await permissionRepository.update(requestParamsId, requestBody);

      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        permission,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.PERMISSION_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
    } catch (e) {
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        message.UNAUTHORIZED,
        null
      );
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.PERMISSION_API_END +
        requestUserId +
        e.message
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  exports.deletePermission = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestUserId = req.user.userId
    const requestParamsId = req.params.id
    let response;
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.PERMISSION_API_START +
      requestUserId +
      JSON.stringify(req.body)
    );
    try {
      const permission = await permissionRepository.delete(requestParamsId);

      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        permission,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.PERMISSION_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_SUCCESS).json(response);
    } catch (e) {
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        message.UNAUTHORIZED,
        null
      );
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.PERMISSION_API_END +
        requestUserId +
        e.message
      );
      res.status(common.HTTP_ERROR).json(response);
    }
  };
})();
