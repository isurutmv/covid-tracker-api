const connectDB = require("../database/db"),
  Permission = require("../models/permissions"),
  Role = require("../models/role");
const common = require("../static/static.json");

async function up() {
  connectDB();

  const permissionList = await Permission.find({}).exec();

  // create admin role
  let Admindata = {
    name: common.USER_TYPE.ADMIN,
    isDefault:true,
    permissions: permissionList.map((a) => a._id),
  };

  let Admiresult = await Role.create(Admindata);

  // create technician role
  let Techdata = {
    name: common.USER_TYPE.TECHNICIAN,
    isDefault:true,
    permissions: permissionList.map((a) => a._id),
  };

  let Techresult = await Role.create(Techdata);
  // create merhants role
  let Merchantdata = {
    name: common.USER_TYPE.MERCHANT,
    isDefault:true,
    permissions: permissionList.map((a) => a._id),
  };

  let Merchantresult = await Role.create(Merchantdata);
  if (!Merchantresult) {
    throw new Error(common.MIGRATION_DETAILS.ERROR_MESSAGES.ROLE_CREATION);
  }
}

async function down() {
  connectDB();

  const result = await Role.deleteOne({
    name: common.MIGRATION_DETAILS.ROLE.NAME,
  }).exec();

  if (!result) {
    throw new Error(common.MIGRATION_DETAILS.ERROR_MESSAGES.ROLE_DELETE);
  }
}

module.exports = { up, down };
