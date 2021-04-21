const mongoose = require("mongoose");
const logger = require("../lib/logger");
const constants = require("../static/static.json");

const connectDB = async () => {
  try {
    //construct the db connection uri
    let connectionURI = null;

    if (process.env.APP_ENV == "local") {
      connectionURI = process.env.DB_CONNECTION_LOCAL;
    } else {
      connectionURI = `${process.env.DB_PREFIX}://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`;
    }

    //connect to the mongodb database
    await mongoose.connect(connectionURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    });
  } catch (error) {
    //log the database error
    logger.log(
      constants.LOGGER.INFO,
      constants.LOGGER.COULD_NOT_CONNECT_TO_THE_DATABASE +
        JSON.stringify(error.message)
    );
  }
};

module.exports = connectDB;
