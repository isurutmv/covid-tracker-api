(() => {
  "use strict";

  var express = require("express");
  var router = express.Router();
  var roleController = require("../controllers/role.controller");
  var validator = require("../../../validators/role");

  /* POST role. */
  router.post("/", validator.create, roleController.createRoles);
  router.route("/").get(roleController.getAllRoles);
  router
    .route("/:id")
    .get(roleController.getoneRole)
    .put(roleController.updateRole)
    .delete(roleController.deleteRole);

  module.exports = router;
})();
