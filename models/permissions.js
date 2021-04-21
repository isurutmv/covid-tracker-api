(() => {
  "use strict";

  var mongoose = require("mongoose");
  var responseMessages = require("../lib/util");

  const permissionsSchema = new mongoose.Schema({
    name: {
      type: String,
      maxlength: [30, responseMessages.EXCEED_CHARACTER_LENGTH],
      trim: false,
    },
    value: {
      type: String,
      maxlength: [30, responseMessages.EXCEED_CHARACTER_LENGTH],
      trim: false,
    },
  });

  // Create indexes for unique fields
  permissionsSchema.set("autoIndex", true);
  module.exports = mongoose.model("Permissions", permissionsSchema);
})();
