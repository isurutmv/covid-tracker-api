(() => {
  "use strict";

  const mongoose = require("mongoose");
  const mongoosePaginate = require("mongoose-paginate");

  const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        maxlength: [50],
        trim: false,
      },
      email: {
        type: String,
        maxlength: [40],
        sparse: true,
        default: null,
      },
      mobileNumber: {
        type: String,
        maxlength: [15],
        sparse: true,
        default: null,
      },
      accessToken: {
        type: String,
        default: null,
      },
      refreshToken: {
        type: String,
        default: null,
      },
      password: {
        type: String,
        default: null,
        trim: true,
        required: false,
      },
      roleID: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Roles",
          default: null,
        },
      ],
      lastPasswordChangeDate: {
        type: Date,
        default: null,
        trim: true,
        required: false,
      },
      resetPasswordToken: {
        type: String,
        default: null,
        trim: true,
        required: false,
      },
      resetPasswordExpires: {
        type: Date,
        default: null,
        trim: true,
        required: false,
      },
      code: {
        type: Number,
        default: null,
        trim: true,
        required: false,
      },
      stripeId: {
        type: String,
        default: null,
        trim: true,
        required: false,
      },
      loginType: {
        type: String,
        required: false,
      },
      isSkipe: {
        type: Boolean,
        default: false,
      },
      mobileVerified: {
        type: Boolean,
        default: false,
      },
      emailVerified: {
        type: Boolean,
        default: false,
      },
      status: {
        type: Number,
        default: 1,
      },
      image: {
        type: String,
        required: false,
      },
      userType: {
        type: String,
        required: true,
        default: "END_USER",
      },
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      commission:{
        type:Number,
        required:false,
        default:0
      }
    },
    {
      timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
      },
    }
  );

  userSchema.plugin(mongoosePaginate);
  // Create indexes for unique fields
  userSchema.set("autoIndex", true);
  module.exports = mongoose.model("User", userSchema);
})();
