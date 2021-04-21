(() => {
  "use strict";

  const express = require("express");
  const router = express.Router();
  const userController = require("../controllers/auth.controller");
  const validator = require("../../../validators/user");
  const multer = require("multer");

  /* POST user authentication. */
  router.post("/login", validator.login, userController.authenticate);

  /* POST user refreshToken */
  router.post(
    "/refreshToken",
    validator.refreshToken,
    userController.refreshToken
  );

  /* POST user signUp */
  router.post("/signUp", validator.signUp, userController.signUp);
  router.post("/card/skip", userController.updateCardStatus);

  /* POST user forget password */
  router.post(
    "/forgetPassword",
    validator.forgetPassword,
    userController.forgetPassword
  );

  /* POST user confirm forget password */
  router.post(
    "/confirmForgetPassword",
    validator.confirmForgetPassword,
    userController.confirmForgetPassword
  );

  /* POST user changePassword */
  router.post(
    "/changePassword",
    validator.changePassword,
    userController.changePassword
  );

  /* GET current user profile details */
  router.get("/profile/me", userController.getProfileDetails);

  /* PUT update user profile details */
  router.put(
    "/profile/:id",
    validator.updateProfileDetails,
    userController.updateProfileDetails
  );

  /* GET user details */
  router.get("/user/list/:id", userController.getUserList);

  /* DELETE user */
  router.delete("/user/:id", userController.deleteUser);

  /* VIEW all admin list */
  router.get("/admin/list", userController.getAdminsDetails);

  /* VIEW all merchant list */
  router.get("/merchant/list", userController.getMerchantsDetails);

  /* VIEW all technician list */
  router.get("/technician/list", userController.getTechniciansDetails);

  //get all end users
  router.get("/enduser/list", userController.getEndUserDetails);

  // user search APIs
  router.get("/admin/search", userController.searchAdminsDetails);
  router.get("/merchant/search", userController.searchMerhantDetails);
  router.get("/technician/search", userController.searchATechnisianDetails);
  router.get("/enduser/search", userController.searchEndUsersDetails);
  router.get("/user/logout", userController.logout);

  // image upload
  router.post(
    "/user/image/upload",
    multer({ dest: "temp/", limits: { fieldSize: 8 * 1024 * 1024 } }).single(
      "image"
    ),
    userController.uploadImage
  );

  module.exports = router;
})();
