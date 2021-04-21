(() => {
  "use strict";

  var express = require("express");
  var router = express.Router();
  var permissionController = require("../controllers/permissions.controller");
  var validator = require("../../../validators/permission");

  /* POST Permissions. */
  router.post("/", validator.create, permissionController.createPermissions);
  router.route("/").get(permissionController.getAllPermissions);
  router
    .route("/:id")
    .get(permissionController.getonePermission)
    .put(permissionController.updatePermission)
    .delete(permissionController.deletePermission);

  module.exports = router;
})();
