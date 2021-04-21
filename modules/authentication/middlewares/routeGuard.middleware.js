(() => {
  "use strict";

  const authService = require("../../authentication/servicers/auth.service");
  const Role = require("../../../models/role");
  const _ = require("lodash");
  const common = require("../../../lib/util");
  const constants = require("../../../static/static.json");
  /**
   * This function check for the given auth user
   * has correct permissions to execute the API route
   * @param {object} req - Request data
   * @param {object} res - Response data
   * @param {String} providedPermission - Permission string 
   * @param {object} next - Next data
   */
  module.exports = (providedPermission) => {

    return async (req, res, next) => {

      const message = common.setLanguage(req.headers['x-localization']);

      //extract token from header
      const token = authService.getTokenFromRequestHeader(req);

      //get the user data with role and permissions
      const userDetails = await authService.validateJwt(token);

      //get user details with roles
      const userWithRoles = await authService.getCurrentUserDetails(userDetails.userId, req.headers['x-localization']);

      //get all the permission associate with roles
      const permissionsList = await Role
        .find({ _id: { $in: userWithRoles.roleID } })
        .populate("permissions", { 'name': 0, '_id': 0, '__v': 0 });

      //push all the permissions into flat array
      let permissionArray = [];
      if (permissionsList != null && permissionsList.length > 0) {

        //push all the permission values into an array
        permissionsList.forEach((list) => {

          //next loop through permission values
          list.permissions.forEach((p) => {
            permissionArray.push(p.value);
          });

        });

      }

      //check the permission is eexist with given list
      const hasPermission = _.includes(permissionArray, providedPermission);

      if (hasPermission) {

        // if user has permission allow the route to access
        next();
      } else {

        //return the error response
        const response = common.commonResponse(
          constants.RESPONSE_SUCCESS.FALSE,
          null,
          message.PERMISSION_DENIED,
          null
        );

        //return the http response
        res.status(constants.HTTP_RESPONSE.HTTP_FORBIDDEN).json(response);
      }


    }
  }
})();
