(() => {
  "use strict";

  const Role = require("../../../models/role");

  exports.create = async (requestBody) => {
    return await Role.create(requestBody);
  };

  exports.getAll = async () => {
    return await Role.find().populate("permissions").exec();
  };

  exports.getOne = async (requestParamsId) => {
    return await Role.findById(requestParamsId).populate("permissions").exec();
  };

  exports.update = async (requestBody, requestParamsId) => {
    return await Role.findByIdAndUpdate(requestParamsId, requestBody, { new: true });
  };

  exports.delete = async (requestParamsId) => {
    return await Role.findByIdAndDelete(requestParamsId);
  };
})();
