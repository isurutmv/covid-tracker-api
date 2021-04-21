const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connectDB = require("./database/db");
const dotenv = require("dotenv");
var admin = require("firebase-admin");

const common = require("./lib/util");
const authentication = require("./modules/authentication/middlewares/auth.middleware");
const commonResponseType = require("./static/static.json");

const indexRouter = require("./routes/index");
const authRouter = require("./modules/authentication/routers/auth.route");
const permissionRouter = require("./modules/authentication/routers/permissions.route");
const roleRouter = require("./modules/authentication/routers/role.route");


dotenv.config();
connectDB();

// end firbase configurations
const app = express();
// agendaService.jobs(agenda);

// app.use("/dash", Agendash(agenda));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// enable cors
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Authenticate all requests
app.use((req, res, next) => {
  authentication.authRequest(req, res, next);
});

app.use("/", indexRouter);
app.use("/v1/authenticate", authRouter);
app.use("/v1/permission", permissionRouter);
app.use("/v1/role", roleRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const message = common.setLanguage(req);
  let response = common.commonResponse(message.NOT_FOUND);
  res.status(commonResponseType.HTTP_RESPONSE.HTTP_NOT_FOUND).json(response);
});

// error handler
app.use((err, req, res, next) => {
  const message = common.setLanguage(
    req.headers[commonResponseType.ACCEPT_LANGUAGE]
  );
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  let response = common.commonResponse(
    commonResponseType.RESPONSE_SUCCESS.FALSE,
    {},
    message.INTERNAL_SERVER_ERROR
  );
  res
    .status(commonResponseType.HTTP_RESPONSE.HTTP_INTERNAL_SERVER_ERROR)
    .json(response);
  res.render("error");
});

module.exports = app;
