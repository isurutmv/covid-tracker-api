(() => {
  "use strict";

  const Permission = require("../../../models/permissions");

  //@des add new permissions
  //@end /api/v1/permission
  exports.create = async (requestBody) => {
    return await Permission.create(requestBody);
  };

  exports.getAll = async () => {
    return await Permission.find();
  };

  exports.getOne = async (requestParamsId) => {
    return await Permission.findById(requestParamsId);
  };

  exports.update = async (requestParamsId, requestBody) => {
    return await Permission.findByIdAndUpdate(requestParamsId, requestBody, {
      new: true,
    });
  };

  exports.delete = async (requestParamsId) => {
    return await Permission.findByIdAndDelete(requestParamsId);
  };
})();
