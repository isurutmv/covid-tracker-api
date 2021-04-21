const connectDB = require("../database/db"),
  Permission = require("../models/permissions");
const common = require("../static/static.json");

async function up() {
  connectDB();

  const result = await Permission.create(common.MIGRATION_DETAILS.PERMISSION);

  if (!result) {
    throw new Error(
      common.MIGRATION_DETAILS.ERROR_MESSAGES.PERMISSION_CREATION
    );
  }
}

async function down() {
  connectDB();

  const result = await Permission.remove({}).exec();

  if (!result) {
    throw new Error(common.MIGRATION_DETAILS.ERROR_MESSAGES.PERMISSION_DELETE);
  }
}

module.exports = { up, down };
