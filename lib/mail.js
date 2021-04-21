(() => {
  ("use strict");

  const fs = require("fs");
  const config = require("config");
  const nodeMailer = require("nodemailer");
  const common = require("../lib/util");
  const path = require("../static/static.json");

  /**
   * Read content of intended email
   * @param {string} fileName File name
   * @param {string} language
   * @return {string}
   */
  const getContentFilePath = (fileName, language) =>
    path.MAIL_FOLDER_PATH + language + "/" + fileName;

  /**
   * Find and replace with matching string
   * @param {string} content Content text
   * @param {string} find Array of string to be find
   * @param {string} replace Array of matching string to be replaced
   * @return {string}
   */
  const replaceString = (content, find, replace) => {
    let regex;

    for (let i = 0; i < find.length; i++) {
      regex = new RegExp(find[i], "g");
      content = content.replace(regex, replace[i]);
    }
    return content;
  };

  /**
   * Read main layout content
   * @callback request callback
   */
  const getTemplateContent = (callback) => {
    fs.readFile(path.FORGET_PASSWORD_TEMPLATE, path.UTF8, (err, data) => {
      if (!err) {
        callback(null, data);
      } else {
        callback(err);
      }
    });
  };

  /**
   * Send password reset link and confirm password code
   * @param {String} email - Recipient email address
   * @param {String} name - Recipient name
   * @param {String} token - Password reset token
   * @param {Number} code -  Confirm password token
   * @param {String} localization -  Language type
   * @param {request} callback callback
   */

  const sendPasswordResetEmail = (
    email,
    name,
    token,
    code,
    localization,
    callback
  ) => {
    const message = common.setLanguage(localization);
    fs.readFile(
      getContentFilePath("forgot-password.html", localization),
      "utf8",
      (error, data) => {
        if (!error) {
          const content = replaceString(data, ["{name}"], [name]);
          getTemplateContent((err, templateContent) => {
            if (!err) {
              const link =
                config.get("email.base_url") +
                "?code=" +
                code +
                "?token=" +
                token +
                "?email=" +
                email;
              const year = [new Date().getFullYear()];
              const emailMsg = replaceString(
                templateContent,
                ["{content}", "{link}", "{code}", "{year}"],
                [content, link, code, year]
              );
              const mailOptions = {
                from: config.get("email.from"),
                to: email,
                subject: message.PASSWORD_RESET,
                html: emailMsg,
              };
              transport.sendMail(mailOptions, (error, data) => {
                callback(error, data);
              });
            } else {
              callback(error);
            }
          });
        } else {
          callback(error);
        }
      }
    );
  };

  const sendConfirmationEmail = (email, name, code, localization, callback) => {
    const message = common.setLanguage(localization);
    fs.readFile(
      getContentFilePath("confirm-email.html", localization),
      "utf8",
      (error, data) => {
        if (!error) {
          const content = replaceString(data, ["{name}"], [name]);
          getTemplateContent((err, templateContent) => {
            if (!err) {
              const year = [new Date().getFullYear()];
              const emailMsg = replaceString(
                templateContent,
                ["{content}", "{code}", "{year}"],
                [content, code, year]
              );
              const mailOptions = {
                from: config.get("email.from"),
                to: email,
                subject: message.REFUND_REQUESTED,
                html: emailMsg,
              };
              transport.sendMail(mailOptions, (error, data) => {
                callback(error, data);
              });
            } else {
              callback(error);
            }
          });
        } else {
          callback(error);
        }
      }
    );
  };

  // send refund request emails to admin users
  const sendRefundNotificationAdmin = (
    refundDetails,
    name,
    email,
    localization,
    callback
  ) => {
    const message = common.setLanguage(localization);
    fs.readFile(
      getContentFilePath("refund-notifi-admin.html", localization),
      "utf8",
      (error, data) => {
        if (!error) {
          const content = replaceString(data, ["{name}"], [name]);
          getTemplateContent((err, templateContent) => {
            if (!err) {
              const year = [new Date().getFullYear()];
              const emailMsg = replaceString(
                templateContent,
                [
                  "{content}",
                  "{user_name}",
                  "{year}",
                  "refund_message",
                  "refund_date",
                  "refund_amount",
                ],
                [
                  content,
                  refundDetails.name,
                  year,
                  refundDetails.message,
                  refundDetails.date,
                  refundDetails.amount,
                ]
              );
              const mailOptions = {
                from: config.get("email.from"),
                to: email,
                subject: message.REFUND_REQUESTED,
                html: emailMsg,
              };
              transport.sendMail(mailOptions, (error, data) => {
                callback(error, data);
              });
            } else {
              callback(error);
            }
          });
        } else {
          callback(error);
        }
      }
    );
  };
  /**
   * Set nodeMailer configuration
   */
  let transport = nodeMailer.createTransport({
    host: config.get("email.host"),
    port: config.get("email.port"),
    ssl: config.get("email.ssl"),
    tls: config.get("email.tls"),
    auth: {
      user: config.get("email.user"),
      pass: config.get("email.pass"),
    },
  });

  /**
   * Export module functions to be accessed from outside
   */
  module.exports = {
    sendPasswordResetEmail: sendPasswordResetEmail,
    sendConfirmationEmail: sendConfirmationEmail,
    sendRefundNotificationAdmin: sendRefundNotificationAdmin,
  };
})();
