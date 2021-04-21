(() => {
  ("use strict");

  const User = require("../../../models/user");
  const isEmpty = require("is-empty");
  const bcrypt = require("bcrypt");
  const common = require("../../../lib/util");
  const mail = require("../../../lib/mail");
  const uniqId = require("uniqid");
  const content = require("../../../static/static.json");
  const generateToken = require("../servicers/auth.service");
  const config = require("config");

  exports.authUser = async (body) => {
    return new Promise((resolve, reject) => {
      User.findOne({ email: body.email })
        .populate({ path: "roleID", populate: { path: "permissions" } })
        .exec((err, data) => {
          if (err || isEmpty(data)) {
            reject("Invalid User");
          } else {
            bcrypt.compare(body.password, data.password, (err, doesMatch) => {
              if (doesMatch) {
                resolve(data);
              } else {
                reject("Invalid User");
              }
            });
          }
        });
    });
  };

  // update User Details
  exports.updateUser = async (id, body) => {
    const user = await User.findOneAndUpdate({ _id: id }, body, {
      new: true,
    }).select({ password: 0, code: 0, accessToken: 0, refreshToken: 0 });

    return user;
  };

  // check end users
  exports.getEndusers = async (data, type) => {
    if (data.email !== undefined || !isEmpty(data.email)) {
      const user = await User.findOne({ email: data.email });
      if (user) {
        return user;
      } else if (!type) {
        return false;
      } else {
        return await User.create(data);
      }
    } else {
      return findMobileUsers(data, type);
    }
  };
  // check role asigned or not
  exports.checkRole = async (roleId) => {
    const user = await User.findOne({ roleID: roleId });
    if (user) {
      return true;
    }
    return false;
  };


  exports.createUser = async (body, tokens, requestUserId) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(body.password, 5, (err, bcryptedPassword) => {
        if (err) {
          reject(err);
        } else {
          Notification.createNotifications(
            content.NOTIFICATION.EVENT.MERCHANT_ADDED,
            requestUserId,
            body
          );
          resolve(
            User.create({
              email: body.email,
              name: body.name,
              password: bcryptedPassword,
              roleID: body.roleID,
              mobileNumber: body.mobileNumber,
              addedBy: requestUserId,
              userType: body.userType,
              commission: body.commission,
              accessToken: tokens[0],
              refreshToken: tokens[1],
            })
          );
        }
      });
    });
  };

  exports.setDetails = async (details, localization) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      if (details.email !== undefined || !isEmpty(details.email)) {
        User.findOne({ email: details.email })
          .populate({ path: "roleID", populate: { path: "permissions" } })
          .populate("addedBy", "name")
          .exec((err, data) => {
            if (err || isEmpty(data)) {
              reject(message.INVALID_EMAIL);
            } else {
              const body = {
                accessToken: details.accessToken,
                refreshToken: details.refreshToken,
                loginType: content.LOGIN_TYPE.BY_EMAIL,
              };
              User.findOneAndUpdate({ email: details.email }, body, {
                new: true,
              })
                .populate({ path: "roleID", populate: { path: "permissions" } })
                .populate("addedBy", "name")
                .exec((err, createdObject) => {
                  if (err) {
                    reject(message.INVALID_EMAIL);
                  } else {
                    resolve(createdObject);
                  }
                });
            }
          });
      } else {
        const body = {
          accessToken: details.accessToken,
          refreshToken: details.refreshToken,
          loginType: content.LOGIN_TYPE.BY_MOBILE,
        };
        User.findOneAndUpdate(
          { mobileNumber: details.mobileNumber },
          body,
          (err, createdObject) => {
            if (err) {
              reject(message.INVALID_MOBILE_NUMBER);
            } else {
              resolve(createdObject);
            }
          }
        );
      }
    });
  };

  exports.forgetPassword = async (requestBody, localization) => {
    return new Promise((resolve, reject) => {
      const message = common.setLanguage(localization);
      User.findOne({ email: requestBody.email }, (err, user) => {
        if (err || isEmpty(user)) {
          reject(message.INVALID_EMAIL);
        } else {
          const expires = new Date();
          expires.setHours(expires.getHours() + 6);
          user.resetPasswordExpires = expires;
          user.resetPasswordToken = uniqId();
          const code = Math.floor(Math.random() * 90000) + 10000;
          user.code = code;

          User.findOneAndUpdate(
            { email: requestBody.email },
            { $set: user },
            (err, user) => {
              if (err) {
                reject(message.INVALID_EMAIL);
              } else {
                mail.sendPasswordResetEmail(
                  user.email,
                  user.name,
                  user.resetPasswordToken,
                  code,
                  localization,
                  (err, data) => {
                    if (err || isEmpty(data)) {
                      reject(err);
                    }
                    resolve(message.EMAIL_HAS_BEEN_SENT_TO_YOUR_EMAIL);
                  }
                );
              }
            }
          );
        }
      });
    });
  };

  exports.confirmForgetPassword = async (requestBody, localization) => {
    return new Promise((resolve, reject) => {
      const message = common.setLanguage(localization);
      User.findOne({ email: requestBody.email }, (err, user) => {
        if (err || isEmpty(user)) {
          reject(message.INVALID_EMAIL);
        } else {
          const currentDate = new Date();
          if (currentDate < user.resetPasswordExpires) {
            if (user.code === requestBody.confirmationCode) {
              bcrypt.hash(requestBody.password, 5, (err, bcryptedPassword) => {
                if (err) {
                  reject(message.PASSWORD_CHANGE_FAIL);
                } else {
                  const body = {
                    password: bcryptedPassword,
                    lastPasswordChangeDate: new Date(),
                  };
                  User.findOneAndUpdate(
                    { email: requestBody.email },
                    body,
                    (err, createdObject) => {
                      if (err) {
                        reject(message.PASSWORD_CHANGE_FAIL);
                      } else {
                        resolve(message.PASSWORD_CHANGED_SUCCESS);
                      }
                    }
                  );
                }
              });
            } else {
              reject(message.CODE_IS_INCORRECT);
            }
          } else {
            reject(message.TOKEN_HAS_EXPIRED);
          }
        }
      });
    });
  };

  exports.validatePassword = async (requestBody, localization) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.findOne({ email: requestBody.email }, (err, user) => {
        if (err || isEmpty(user)) {
          reject(message.INVALID_EMAIL);
        } else {
          bcrypt.compare(
            requestBody.oldPassword,
            user.password,
            (err, doesMatch) => {
              if (doesMatch) {
                resolve(user);
              } else {
                reject(message.OLD_PASSWORD_IS_INCORRECT);
              }
            }
          );
        }
      });
    });
  };

  exports.changePassword = async (requestBody, localization) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      bcrypt.hash(requestBody.newPassword, 5, (err, bcryptedPassword) => {
        if (err || isEmpty(bcryptedPassword)) {
          reject(err);
        } else {
          const body = {
            password: bcryptedPassword,
            lastPasswordChangeDate: new Date(),
          };
          User.findOneAndUpdate(
            { email: requestBody.email },
            body,
            (err, createdObject) => {
              if (err) {
                reject(message.INVALID_EMAIL);
              } else {
                resolve(createdObject);
              }
            }
          );
        }
      });
    });
  };

  exports.getUser = async (requestUserId, localization) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.findOne({ _id: requestUserId }, (err, user) => {
        if (err || isEmpty(user)) {
          reject(message.INVALID_USER_ID);
        }
        resolve(user);
      });
    });
  };

  exports.checkJwt = async (token) => {
    try {
      const user = await User.findOne({
        accessToken: token,
      });

      return user;
    } catch (err) { }
  };
  exports.getCurrentUserDetails = async (requestUserId, localization) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.findOne({
        _id: requestUserId,
      })
        .populate("roleID", { __v: 0 })
        .select({
          accessToken: 0,
          refreshToken: 0,
          __v: 0,
          password: 0,
          lastPasswordChangeDate: 0,
          resetPasswordToken: 0,
          resetPasswordExpires: 0,
        })
        .exec((err, object) => {
          if (err || isEmpty(object)) {
            reject(message.USERS_NOT_FOUND);
          }
          resolve(object);
        });
    });
  };

  exports.comparePassword = async (localization, user, requestBody) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      bcrypt.compare(
        requestBody.oldPassword,
        user.password,
        (err, doesMatch) => {
          if (doesMatch) {
            bcrypt.hash(requestBody.newPassword, 5, (err, bcryptedPassword) => {
              if (err || isEmpty(bcryptedPassword)) {
                reject(err);
              } else {
                const body = {
                  name: requestBody.name,
                  email: requestBody.email,
                  mobileNumber: requestBody.mobileNumber,
                  password: bcryptedPassword,
                  lastPasswordChangeDate: new Date(),
                };
                User.findOneAndUpdate(
                  { email: requestBody.email },
                  body,
                  (err, createdObject) => {
                    if (err) {
                      reject(message.INVALID_EMAIL);
                    } else {
                      resolve(message.PROFILE_UPDATED_SUCCESS);
                    }
                  }
                );
              }
            });
          } else {
            reject(message.OLD_PASSWORD_IS_INCORRECT);
          }
        }
      );
    });
  };

  exports.getUserList = (requestPramsId, localization, requestQuery) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.find({
        roleID: { $elemMatch: { $in: requestPramsId } },
      })
        .skip(requestQuery)
        .limit(config.get("paginationLimit"))
        .populate("roleID", { __v: 0 })
        .select({
          accessToken: 0,
          refreshToken: 0,
          __v: 0,
          password: 0,
          lastPasswordChangeDate: 0,
          resetPasswordToken: 0,
          resetPasswordExpires: 0,
        })
        .exec((err, object) => {
          if (err || isEmpty(object)) {
            reject(message.USERS_NOT_FOUND);
          }
          resolve(object);
        });
    });
  };

  exports.deleteUserById = (requestPramsId, localization) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(
        { _id: requestPramsId },
        { $set: { status: content.USER_STATUS.DELETED } }
      ).exec((err, object) => {
        if (err || isEmpty(object)) {
          reject(message.INVALID_USER_ID);
        }
        resolve(object);
      });
    });
  };

  //get all users without pagination
  exports.getUsersByUserType = (userType) => {
    return new Promise((resolve, reject) => {
      User.find({
        userType: userType,
        status: content.USER_STATUS.ACTIVE,
      }).exec((err, object) => {
        if (err || isEmpty(object)) {
          reject({
            status: false,
          });
        }
        resolve(object);
      });
    });
  };
  exports.findAllAdmins = (requestQuery, localization) => {
    const message = common.setLanguage(localization);

    return new Promise((resolve, reject) => {
      User.paginate(
        {
          userType: content.USER_TYPE.ADMIN,
          status: content.USER_STATUS.ACTIVE,
        },
        {
          page: requestQuery,
          limit: 10,
          select: {
            accessToken: 0,
            refreshToken: 0,
            __v: 0,
            password: 0,
            lastPasswordChangeDate: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            updated_at: 0,
          },
          sort: { created_at: -1 },
          populate: [
            {
              path: "roleID",
              populate: { path: "permissions" },
            },
            {
              path: "addedBy",
              select: { name: 1 },
            },
          ],
        },
        function (err, result) {
          if (err) {
            reject(err);
          }
          if (isEmpty(result)) {
            reject({
              status: content.HTTP_RESPONSE.HTTP_NOT_FOUND,
              message: message.ADMINS_NOT_FOUND,
            });
          }
          resolve(result);
        }
      );
    });
  };

  exports.findAllMerchants = (requestQuery, localization) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.paginate(
        {
          userType: content.USER_TYPE.MERCHANT,
          status: content.USER_STATUS.ACTIVE,
        },
        {
          page: requestQuery,
          limit: 10,
          select: {
            accessToken: 0,
            refreshToken: 0,
            __v: 0,
            password: 0,
            lastPasswordChangeDate: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            updated_at: 0,
          },
          sort: { created_at: -1 },
          populate: [
            {
              path: "roleID",
              populate: { path: "permissions" },
            },
            {
              path: "addedBy",
              select: { name: 1 },
            },
          ],
        },
        function (err, result) {
          if (err) {
            reject(err);
          }
          if (isEmpty(result)) {
            reject({
              status: content.HTTP_RESPONSE.HTTP_NOT_FOUND,
              message: message.MERCHANTS_NOT_FOUND,
            });
          }
          resolve(result);
        }
      );
    });
  };

  exports.findAllTechnicians = (requestQuery, localization) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.paginate(
        {
          userType: content.USER_TYPE.TECHNICIAN,
          status: content.USER_STATUS.ACTIVE,
        },
        {
          page: requestQuery,
          limit: 10,
          select: {
            accessToken: 0,
            refreshToken: 0,
            __v: 0,
            password: 0,
            lastPasswordChangeDate: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            updated_at: 0,
          },
          sort: { created_at: -1 },
          populate: [
            {
              path: "roleID",
              populate: { path: "permissions" },
            },
            {
              path: "addedBy",
              select: { name: 1 },
            },
          ],
        },
        function (err, result) {
          if (err) {
            reject(err);
          }
          if (isEmpty(result)) {
            reject({
              status: content.HTTP_RESPONSE.HTTP_NOT_FOUND,
              message: message.MERCHANTS_NOT_FOUND,
            });
          }
          resolve(result);
        }
      );
    });
  };

  exports.findAllEndUsers = (requestQuery, localization) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.paginate(
        {
          userType: content.USER_TYPE.END_USER,
          status: content.USER_STATUS.ACTIVE,
        },
        {
          page: requestQuery,
          limit: 10,
          select: {
            accessToken: 0,
            refreshToken: 0,
            __v: 0,
            password: 0,
            lastPasswordChangeDate: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            updated_at: 0,
          },
          sort: { created_at: -1 },
          populate: [
            {
              path: "roleID",
              populate: { path: "permissions" },
            },
            {
              path: "addedBy",
              select: { name: 1 },
            },
          ],
        },
        function (err, result) {
          if (err) {
            reject(err);
          }
          if (isEmpty(result)) {
            reject({
              status: content.HTTP_RESPONSE.HTTP_NOT_FOUND,
              message: message.MERCHANTS_NOT_FOUND,
            });
          }
          resolve(result);
        }
      );
    });
  };
  exports.searchAllAdmins = (requestQuery, localization, search) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.paginate(
        {
          userType: content.USER_TYPE.ADMIN,
          status: content.USER_STATUS.ACTIVE,
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
        {
          page: requestQuery,
          limit: 10,
          select: {
            accessToken: 0,
            refreshToken: 0,
            __v: 0,
            password: 0,
            lastPasswordChangeDate: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            updated_at: 0,
          },
          sort: { created_at: -1 },
          populate: [
            {
              path: "roleID",
              populate: { path: "permissions" },
            },
            {
              path: "addedBy",
              select: { name: 1 },
            },
          ],
        },
        function (err, result) {
          if (err) {
            reject(err);
          }
          if (isEmpty(result)) {
            reject({
              status: content.HTTP_RESPONSE.HTTP_NOT_FOUND,
              message: message.MERCHANTS_NOT_FOUND,
            });
          }
          resolve(result);
        }
      );
    });
  };

  exports.searchAllMerchants = (requestQuery, localization, search) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.paginate(
        {
          userType: content.USER_TYPE.MERCHANT,
          status: content.USER_STATUS.ACTIVE,
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
        {
          page: requestQuery,
          limit: 10,
          select: {
            accessToken: 0,
            refreshToken: 0,
            __v: 0,
            password: 0,
            lastPasswordChangeDate: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            updated_at: 0,
          },
          sort: { created_at: -1 },
          populate: [
            {
              path: "roleID",
              populate: { path: "permissions" },
            },
            {
              path: "addedBy",
              select: { name: 1 },
            },
          ],
        },
        function (err, result) {
          if (err) {
            reject(err);
          }
          if (isEmpty(result)) {
            reject({
              status: content.HTTP_RESPONSE.HTTP_NOT_FOUND,
              message: message.MERCHANTS_NOT_FOUND,
            });
          }
          resolve(result);
        }
      );
    });
  };
  exports.searchAllTechnicians = (requestQuery, localization, search) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.paginate(
        {
          userType: content.USER_TYPE.TECHNICIAN,
          status: content.USER_STATUS.ACTIVE,
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
        {
          page: requestQuery,
          limit: 10,
          select: {
            accessToken: 0,
            refreshToken: 0,
            __v: 0,
            password: 0,
            lastPasswordChangeDate: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            updated_at: 0,
          },
          sort: { created_at: -1 },
          populate: [
            {
              path: "roleID",
              populate: { path: "permissions" },
            },
            {
              path: "addedBy",
              select: { name: 1 },
            },
          ],
        },
        function (err, result) {
          if (err) {
            reject(err);
          }
          if (isEmpty(result)) {
            reject({
              status: content.HTTP_RESPONSE.HTTP_NOT_FOUND,
              message: message.MERCHANTS_NOT_FOUND,
            });
          }
          resolve(result);
        }
      );
    });
  };

  exports.searchAllEndUsers = (requestQuery, localization, search) => {
    const message = common.setLanguage(localization);
    return new Promise((resolve, reject) => {
      User.paginate(
        {
          userType: content.USER_TYPE.END_USER,
          status: content.USER_STATUS.ACTIVE,
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
        {
          page: requestQuery,
          limit: 10,
          select: {
            accessToken: 0,
            refreshToken: 0,
            __v: 0,
            password: 0,
            lastPasswordChangeDate: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            updated_at: 0,
          },
          sort: { created_at: -1 },
          populate: [
            {
              path: "roleID",
              populate: { path: "permissions" },
            },
            {
              path: "addedBy",
              select: { name: 1 },
            },
          ],
        },
        function (err, result) {
          if (err) {
            reject(err);
          }
          if (isEmpty(result)) {
            reject({
              status: content.HTTP_RESPONSE.HTTP_NOT_FOUND,
              message: message.MERCHANTS_NOT_FOUND,
            });
          }
          resolve(result);
        }
      );
    });
  };

  exports.getCommission = async (userId) => {
    try {
      const userDetails = await User.findById(userId).select({ commission: 1 });
      return userDetails.commission;
    } catch (error) {
      throw new Error(error);
    }
  };

  // get all admin users email address
  exports.getAdminEmails = async () => {
    try {
      return await User.find({ userType: content.USER_TYPE.ADMIN }).select({
        email: 1,
        name: 1,
      });
    } catch (error) {
      throw new Error(error);
    }
  };
})();
