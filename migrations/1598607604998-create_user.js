const connectDB = require("../database/db")
  , User = require("../models/user")
  , Role = require("../models/role");
const common = require("../static/static.json");

async function up() {
  connectDB();

  const role = await Role.find({}).exec()

  const data = {
    "name": common.MIGRATION_DETAILS.SUPER_ADMIN_DETAILS.NAME,
    "email": common.MIGRATION_DETAILS.SUPER_ADMIN_DETAILS.EMAIL,
    "password": common.MIGRATION_DETAILS.SUPER_ADMIN_DETAILS.PASSWORD,
    "roleID": [
      role[0]._id
    ],
    "userType": common.USER_TYPE.SUPER_ADMIN,
    "loginType": common.LOGIN_TYPE.BY_EMAIL
  }
  const result = await User.create(data);

  if (!result) {
    throw new Error(common.MIGRATION_DETAILS.ERROR_MESSAGES.USER_CREATION);
  }
}


async function down() {
  connectDB();

  const result = await User.deleteOne({ email: common.MIGRATION_DETAILS.SUPER_ADMIN_DETAILS.EMAIL })

  if (!result) {
    throw new Error(common.MIGRATION_DETAILS.ERROR_MESSAGES.USER_DELETE);
  }
}

module.exports = { up, down };
