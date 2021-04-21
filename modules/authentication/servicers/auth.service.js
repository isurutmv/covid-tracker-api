
(() => {
  ("use strict");
  const jwt = require("jsonwebtoken");
  const config = require("config");
  const fs = require("fs");
  const isEmpty = require("is-empty");
  const constant = require("../../../static/static.json");
  const authRepo = require("../repositories/auth.repository");
  const common = require("../../../lib/util");
  // Load the AWS SDK for Node.js
  var aws = require("aws-sdk");

  const getJwt = (user) => {
    const data = {
      userId: user._id,
      email: user.email,
      name: user.name,
    };
    let tokens = [];
    const accessToken = jwt.sign(data, config.get("Access_Token"), {
      expiresIn: config.get("AccessTokenExpirationTime"),
    });
    const refreshToken = jwt.sign(data, config.get("Refresh_Token"), {
      expiresIn: config.get("RefreshTokenExpirationTime"),
    });
    tokens.push(accessToken);
    tokens.push(refreshToken);
    return tokens;
  };

  const refreshJwt = (refreshToken) => {
    const user = jwt.verify(refreshToken, config.get("Refresh_Token"));

    return generateAccessToken({ name: user.name });
  };

  const generateAccessToken = (user) =>
    jwt.sign(user, config.get("Access_Token"), {
      expiresIn: config.get("AccessTokenExpirationTime"),
    });

  const validateJwt = (token) => {
    let decoded;
    try {
      decoded = jwt.verify(token, config.get("Access_Token"));
    } catch (err) {
      return err;
    }
    return decoded;
  };

  /**
   * set login response structure
   * @param {object} userDetails
   * @returns {object}
   */
  const authResponse = (userDetails) => ({
    accessToken: userDetails.accessToken,
    refreshToken: userDetails.refreshToken,
    profile: {
      roleID: userDetails.roleID,
      code: userDetails.code,
      name: userDetails.name,
      email: userDetails.email,
      addedBy: userDetails.addedBy,
      mobileNumber: userDetails.mobileNumber,
      loginType: userDetails.loginType,
      id: userDetails._id,
    },
  });

  /**
   * current user details
   * @param {string} requestUserId - requested userId
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const getCurrentUserDetails = (requestUserId, localization) =>
    authRepo.getCurrentUserDetails(requestUserId, localization);

  /**
   * get user list
   * @param {string} requestPramsId - request id ex: 5f2d45b6795fbd1a38dd8595
   * @param {string} localization - Language type ex: en-US
   * @param {string} requestQuery - requested page no
   * @returns {object}
   */
  const getUsers = async (requestPramsId, localization, requestQuery) => {
    return await authRepo.getUserList(
      requestPramsId,
      localization,
      Number(requestQuery)
    );
  };

  /**
   * delete user
   * @param {string} requestPramsId - query params ex: 5f2d45b6795fbd1a38dd8595
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const deleteUser = async (requestPramsId, localization) => {
    //check user merchant or not
    const User = await authRepo.getUser(requestPramsId, localization);
    if (User.userType == constant.USER_TYPE.MERCHANT) {
      // if merchant check location avilable or not
      const isAvailable = await Location.checkMerchantAssign(requestPramsId);
      if (isAvailable) {
        throw new Error(constant.ERROR_MESSAGES.USER_ASSIGNED_TO_LOCATION);
      }
    }
    return await authRepo.deleteUserById(requestPramsId, localization);
  };

  /**
   * admins details
   * @param {number} requestQuery - page number ex: 1
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const adminList = (requestQuery, localization) =>
    authRepo.findAllAdmins(Number(requestQuery), localization);

  const updateStatus = async (requestPramsId, request) => {
    const user = await authRepo.updateUser(requestPramsId, request);
    return user;
  };

  /**
   * merchants details
   * @param {number} requestQuery - page number ex: 1
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const merchantList = (requestQuery, localization) =>
    authRepo.findAllMerchants(Number(requestQuery), localization);

  /**
   * technicians details
   * @param {number} requestQuery - page number ex: 1
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const techniciansList = (requestQuery, localization) =>
    authRepo.findAllTechnicians(Number(requestQuery), localization);

  /**
   * @param {number} requestQuery - page number ex: 1
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const endUserList = (requestQuery, localization) =>
    authRepo.findAllEndUsers(Number(requestQuery), localization);

  /**
   * @param {number} requestQuery - page number ex: 1
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const searchAdmin = (requestQuery, localization, search) =>
    authRepo.searchAllAdmins(Number(requestQuery), localization, search);

  /**
   * @param {number} requestQuery - page number ex: 1
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const searchMerchant = (requestQuery, localization, search) =>
    authRepo.searchAllMerchants(Number(requestQuery), localization, search);

  /**
   * @param {number} requestQuery - page number ex: 1
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const searchTechnicians = (requestQuery, localization, search) =>
    authRepo.searchAllTechnicians(Number(requestQuery), localization, search);

  /**
   * @param {number} requestQuery - page number ex: 1
   * @param {string} localization - Language type ex: en-US
   * @returns {object}
   */
  const searchEndUser = (requestQuery, localization, search) =>
    authRepo.searchAllEndUsers(Number(requestQuery), localization, search);

  // user profile image upload
  const uploadImage = async (req, userId) => {
    try {
      const imageURL = await imageUpload(req);
      const user = await authRepo.updateUser(userId, {
        image: imageURL,
      });
      return user;
    } catch (err) {
      throw new Error(err);
    }
  };

  const imageUpload = async (req) => {
    return new Promise((resolve, reject) => {
      aws.config.setPromisesDependency();

      const s3 = new aws.S3();
      var params = {
        ACL: config.get("aws.ACL_PUBLIC"),
        Bucket: config.get("aws.BUCKET_NAME"),
        ContentType: config.get("aws.CONTENT_TYPE"),
        Body: fs.createReadStream(req.file.path),
        Key: `${config.get("aws.END_UER_PATH")}${new Date().getTime()}${req.file.originalname
          }`,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          fs.unlinkSync(req.file.path);
          resolve(data.Location);
        }
      });
    });
  };
  /**
   * Logut User
   */
  const logout = async (userId) => {
    try {
      const user = await authRepo.updateUser(userId, {
        accessToken: null,
        refreshToken: null,
      });
      return {
        status: true,
      };
    } catch (err) {
      throw new Error(err);
    }
  };

  const checkJwt = async (token) => {
    const userDetails = await authRepo.checkJwt(token);

    if (userDetails) {
      return true;
    }
    return false;
  };

  /**
   * This function will extract the bearer token form
   * Request header object
   * @param {request} req HTTP request object
   * @returns {string} token auth token JWT
   */
  const getTokenFromRequestHeader = (req) => {
    if (!isEmpty(req.headers["authorization"])) {
      let authHeader = req.headers["authorization"];
      authHeader = authHeader.replace("Bearer", "");
      authHeader = authHeader.trim();

      return authHeader;
    }
  }


  /**
   * Check the given user account id is matching with user type
   * acceptable user types are [ADMIN, MERCHANT, TECHNICIAN, END_USER]
   * @param {objectID} userID user model id
   * @param {String} userType user types [ADMIN, MERCHANT, TECHNICIAN, END_USER]
   * @param {String} localization localization header value default en
   * @returns {boolean} is user matched with provided user type
   */
  const isValidUserType = async (userId, userType, localization = 'en-US') => {

    //set message object
    const message = common.setLanguage(localization);
    try {
      //get the user by user id
      const user = await authRepo.getUser(userId, localization);
      //check if user found is found check for the user type
      if (user != null && user.userType == userType) {
        return true;
      } else {
        return false;
      }

    } catch (error) {

      //throw error for all invalid user types
      throw Error(message.CAN_NOT_FIND_THE_USER);
    }



  }
  /**
   * Export module functions to be accessed from outside
   */
  module.exports = {
    getJwt: getJwt,
    refreshJwt: refreshJwt,
    validateJwt: validateJwt,
    authResponse: authResponse,
    getCurrentUserDetails: getCurrentUserDetails,
    getUsers: getUsers,
    deleteUser: deleteUser,
    adminList: adminList,
    updateStatus: updateStatus,
    merchantList: merchantList,
    techniciansList: techniciansList,
    endUserList: endUserList,
    searchAdmin: searchAdmin,
    searchMerchant: searchMerchant,
    searchTechnicians: searchTechnicians,
    searchEndUser: searchEndUser,
    uploadImage: uploadImage,
    logout: logout,
    checkJwt: checkJwt,
    getTokenFromRequestHeader: getTokenFromRequestHeader,
    isValidUserType: isValidUserType
  };
})();
