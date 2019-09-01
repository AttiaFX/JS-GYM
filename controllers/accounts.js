"use strict";

const userstore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup to the GYM App"
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to the to the GYM App"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("assessments", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Sign-up to the GYM App"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    if (user)
      { if (user.firstName !== "Marge")
        {
          response.cookie("assessments", user.email);
          logger.info(`logging in ${user.email}`);
          response.redirect("/dashboard");
        }
        else
        {
          response.cookie("assessments", user.email);
          logger.info(`logging in ${user.email}`);
          response.redirect("/trainer-dash");
        }

    }
  else
    {
    response.redirect("/login");
  }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.assessments;
    return userstore.getUserByEmail(userEmail);
  },

  settings(request, response) {
    logger.info("Rendering About");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Settings for Logged In User",
      member: userstore.getUserById(loggedInUser.id)
    };
    response.render("settings", viewData);
  },

  updateSettings(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    loggedInUser.email = request.body.email;
    loggedInUser.firstName = request.body.firstName;
    loggedInUser.lastName = request.body.lastName;
    loggedInUser.address = request.body.address;
    loggedInUser.password = request.body.password;
    loggedInUser.gender = request.body.gender;
    loggedInUser.height = request.body.height;
    loggedInUser.startingWeight = request.body.startingWeight;

    response.redirect("settings")
  },



};

module.exports = accounts;