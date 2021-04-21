(() => {
  "use strict";

  const common = require("../../../lib/util");
  const RoleRepository = require("../repositories/role.repository");
  const RoleService = require("../servicers/role.service");
  const commonResponseType = require("../../../static/static.json");
  const logger = require("../../../lib/logger");

  exports.createRoles = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestBody = req.body
    const requestUserId = req.user.userId
    let response;
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.ROLE_API_START +
      requestUserId +
      JSON.stringify(requestBody)
    );
    try {
      const Role = await RoleRepository.create(requestBody);
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        Role,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.ROLE_API_SUCCESS +
        requestUserId +
        JSON.stringify(response)
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_CREATED).json(response);
    } catch (e) {
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.FALSE,
        null,
        e.message,
        null
      );
      logger.log(
        commonResponseType.LOGGER.ERROR,
        commonResponseType.LOGGER.ROLE_API_END + requestUserId + e.message
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  exports.getAllRoles = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestUserId = req.user.userId
    let response;
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.ROLE_API_START +
      requestUserId +
      JSON.stringify(req.body)
    );
    try {
      const Roles = await RoleRepository.getAll();
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        Roles,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.ROLE_API_SUCCESS +
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
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  exports.getoneRole = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestUserId = req.user.userId
    const requestParamsId = req.params.id
    let response;
    try {
      const Role = await RoleRepository.getOne(requestParamsId);
      if (!Role) {
        return res.status(commonResponseType.HTTP_RESPONSE.HTTP_NOT_FOUND);
      }
      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        Role,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.ROLE_API_SUCCESS +
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
        commonResponseType.LOGGER.ROLE_API_END + requestUserId + e.message
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  exports.updateRole = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestUserId = req.user.userId
    const requestParamsId = req.params.id
    const requestBody = req.body
    let response;
    try {
      const Role = await RoleRepository.update(requestBody, requestParamsId);

      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        Role,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.ROLE_API_SUCCESS +
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
        commonResponseType.LOGGER.ROLE_API_END + requestUserId + e.message
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };

  exports.deleteRole = async (req, res, next) => {
    const message = common.setLanguage(req.headers[commonResponseType.ACCEPT_LANGUAGE]);
    const requestUserId = req.user.userId
    const requestParamsId = req.params.id
    let response;
    logger.log(
      commonResponseType.LOGGER.INFO,
      commonResponseType.LOGGER.ROLE_API_START +
      requestUserId +
      JSON.stringify(req.body)
    );
    try {
      const Role = await RoleService.deleteRole(requestParamsId);

      response = common.commonResponse(
        commonResponseType.RESPONSE_SUCCESS.TRUE,
        Role,
        message.SUCCESS_MESSAGE,
        null
      );
      logger.log(
        commonResponseType.LOGGER.INFO,
        commonResponseType.LOGGER.ROLE_API_SUCCESS +
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
        commonResponseType.LOGGER.ROLE_API_END + requestUserId + e.message
      );
      res.status(commonResponseType.HTTP_RESPONSE.HTTP_ERROR).json(response);
    }
  };
})();
