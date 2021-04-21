(() => {
    "use strict";

    var mongoose = require("mongoose");
    var responseMessages = require("../lib/util");

    const roleSchema = new mongoose.Schema({
        name: {
            type: String,
            maxlength: [30, responseMessages.EXCEED_CHARACTER_LENGTH],
            trim: false,
        },
        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Permissions",
                default: null
            }
        ],
        isDefault:{
            type:Boolean,
            default: false,
        }
    });

    // Create indexes for unique fields
    roleSchema.set("autoIndex", true);
    module.exports = mongoose.model("Roles", roleSchema);
})();
